import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { updateNotePositionType, setNote, saveNotes } from "../../actions/map.js";

import map, { noteListSelector, settingsSelector, noteSelector } from "../../reducers/map.js";
store.addReducers({
	map
});

import "../notes/map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
		return {
			_id: String,
			_note: Object,
			_noteList: Array,
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
			<div>
				<div>&nbsp;${this._note.title}</div>
				<div>&nbsp;${this._note.text}</div>
			</div>
			<div class="mind-map__area">
				${this._noteList.map((note) => {
					return html`
						<map-note
							.note="${note}"
							.scale="${this.scale}"
							.xShift="${32}"
							.yShift="${88}"></map-note>`;
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
		store.dispatch(setNote());
	}

	stateChanged(state) {
		this._note = noteSelector(state);
		this._noteList = noteListSelector(state);
		this._positionType = settingsSelector(state).positionType;
	}

	increaseScale() {
		this.lerpScale(2);
	}

	descreaseScale() {
		this.lerpScale(.5);
	}

	lerpScale(modifier = 1, animLength = 500) {
		let startScale = this.scale;
		let newScale = this.scale * modifier;

		let startTime = (new Date()).getTime();

		let interval = setInterval(() => {
			let totalTime = (new Date()).getTime() - startTime;

			this.scale = startScale + (totalTime / animLength) * (newScale - startScale);

			if (totalTime >= animLength) {
				clearInterval(interval);
			}
		}, 10);
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
		saveNotes([this._note]);
		saveNotes(this._noteList);
	}

	export() {
		let now = (new Date()).toUTCString().toLocaleLowerCase().replace(/\s|,|:/gm, "-");
		let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));
		makeDownload(`scales-${now}`, JSON.stringify(noteList));
	}
}

window.customElements.define("mind-map", MindMap);
