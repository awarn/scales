import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { updateNotePositionType, setCurrentNote, saveNotes, setNotePosition } from "../../actions/map.js";

import map, { drawnNotesListSelector, settingsSelector, currentNoteSelector, saveNoteListSelector, dragNoteSelector } from "../../reducers/map.js";
store.addReducers({
	map
});

import "../notes/current-note.js";
import "../notes/map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
		return {
			_id: String,
			_note: Object,
			_noteList: Array,
			_saveNoteList: Array,
			_positionType: String,
			_dragNote: Object,
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
			<current-note></current-note>
			<div
				@dragover="${this.handleDragover}"
				@drop="${this.handleDrop}"
				class="mind-map__area">
				${this._noteList.map((note) => {
					return html`
						<map-note
							.note="${note}"
							.scale="${this.scale}"></map-note>`;
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
		store.dispatch(setCurrentNote());
	}

	stateChanged(state) {
		this._currentNote = currentNoteSelector(state);
		this._noteList = drawnNotesListSelector(state);
		this._saveNoteList = saveNoteListSelector(state);
		this._positionType = settingsSelector(state).positionType;
		this._dragNote = dragNoteSelector(state);
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	handleDrop(event) {
		event.preventDefault();
		if (this._positionType === "absolute") {
			this.updatePosition(event.clientX, event.clientY);
		}
	}

	updatePosition(clientX, clientY) {
		let xPos = (clientX - 32) / this.scale;
		let yPos = (clientY - 152) / this.scale;
		store.dispatch(setNotePosition(this._dragNote.id, xPos, yPos, 0));
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
		saveNotes(this._saveNoteList);
	}

	export() {
		let now = (new Date()).toUTCString().toLocaleLowerCase().replace(/\s|,|:/gm, "-");
		let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));
		makeDownload(`scales-${now}`, JSON.stringify(noteList));
	}
}

window.customElements.define("mind-map", MindMap);
