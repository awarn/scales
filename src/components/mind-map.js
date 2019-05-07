import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { getNotes } from "../actions/map.js";

import maps, { noteListSelector } from "../reducers/map.js";
store.addReducers({
	maps
});

import "./map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
		return {
			_noteList: Array,
			_id: String,
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
				}
				.mind-map__actions {
					position: fixed;
					right: 1rem;
					bottom: 1rem;
					height: 3rem;
				}
				.mind-map__area {
					position: relative;
					height: calc(100vh - 6rem);
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
			</div>
		`;
	}

	firstUpdated() {
		store.dispatch(getNotes());
	}

	stateChanged(state) {
		this._noteList = noteListSelector(state);
	}

	increaseScale() {
		this.scale *= 2;
	}

	descreaseScale() {
		this.scale /= 2;
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
