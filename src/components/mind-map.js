import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { getNotes, updateNotePositionType } from "../actions/map.js";

import maps, { noteListSelector, noteSettingsSelector } from "../reducers/map.js";
store.addReducers({
	maps
});

import "./map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
		return {
			_noteList: Array,
			_id: String,
			_positionType: String,
			title: String,
			scale: Number
		}
	}

	static get styles() {
		return [
			css`
				:host {
					display: flex;
					position: relative;
					flex-flow: column;
					align-items: flex-end;
				}
				.mind-map__actions {
					position: sticky;
					right: 1rem;
					bottom: 1rem;
					height: 3rem;
				}
				.mind-map__area {
					position: relative;
					height: calc(100vh - 6rem);
					width: 100%;
					overflow: scroll;
				}
			`
		];
	}

	constructor() {
		super();
		this.scale = 1;
	}

	render() {
		return html`
			<div class="mind-map__area">
				${this._noteList.map((note) => {
					return html`
						<map-note
							.note="${note}"
							.scale="${this.scale}"
							.xShift="${32}"
							.yShift="${88}"></map-note>
					`;
				})}
			</div>
			<div class="mind-map__actions">
				<button @click="${this.increaseScale}">+</button>
				<button @click="${this.descreaseScale}">-</button>
				<button @click="${this.export}">Export</button>
				<button @click="${this.save}">Save</button>
				<button @click="${this.switchPositionType}">List/Map</button>
			</div>
		`;
	}

	firstUpdated() {
		store.dispatch(getNotes());
	}

	stateChanged(state) {
		this._noteList = noteListSelector(state);
		this._positionType = noteSettingsSelector(state).positionType;
	}

	increaseScale() {
		this.scale *= 2;
	}

	descreaseScale() {
		this.scale /= 2;
	}

	switchPositionType() {
		if (this._positionType === "relative") {
			store.dispatch(updateNotePositionType("absolute"));
		}
		else {
			store.dispatch(updateNotePositionType("relative"));
		}
	}

	save() {
		localStorage.setItem("NOTE_LIST", JSON.stringify(this._noteList));
	}

	export() {
		let now = (new Date()).toUTCString().toLocaleLowerCase().replace(/\s|,|:/gm, "-");
		let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));
		makeDownload(`scales-${now}`, JSON.stringify(noteList));
	}
}

window.customElements.define("mind-map", MindMap);
