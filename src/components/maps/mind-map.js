import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { updateNotePositionType, setCurrentNote, setNotePosition, addNote } from "../../actions/map.js";

import { saveNotes, saveTreeRelations } from "../../notes/note-saver.js";

import map, { drawnNotesListSelector, settingsSelector, currentNoteSelector, saveNoteListSelector, dragNoteSelector, dragNoteInfoSelector, relationsSaveSelector } from "../../reducers/map.js";
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
			_saveRelationsList: Array,
			_positionType: String,
			_dragNoteInfo: Object,
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

				@media (min-width: 460px) {
					:host {
						flex-flow: row;
					}
				}

				.actions {
					display: flex;
					position: sticky;
					right: 1rem;
					bottom: 1rem;
					height: 2rem;
					padding: .5rem 0;
					justify-content: flex-end;
				}

				.actions > * {
					margin: 0 0 0 .5rem;
				}

				.area {
					position: relative;
					height: calc(100vh - 8rem);
					width: calc(100% + .5rem);
					margin: 0 -.25rem;
					overflow: scroll;
				}

				@media (min-width: 460px) {
					.area {
						height: calc(100vh - 5rem);
					}
				}

				@media (min-width: 460px) {
					.current {
						flex: 2 0 auto;
					}
				}

				.notes {
					flex-flow: column;
					align-items: flex-end;
				}

				@media (min-width: 460px) {
					.notes {
						flex: 5 0 auto;
					}
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
			<div class="current">
				<current-note></current-note>
			</div>
			<div class="notes">
				<div
					@dragover="${this.handleDragover}"
					@drop="${this.handleDrop}"
					class="area">
					${this._noteList.map((note) => {
						return html`
							<map-note
								.note="${note}"
								.scale="${this.scale}"></map-note>`;
					})}
				</div>
				<div class="actions">
					<button @click="${this.increaseScale}">+</button>
					<button @click="${this.descreaseScale}">-</button>
					<button @click="${this.export}">Export</button>
					<button @click="${this.save}">Save</button>
					<button @click="${this.newNote}">New</button>
					<button @click="${this.switchPositionType}">List/Map</button>
				</div>
			</div>
		`;
	}

	stateChanged(state) {
		this._currentNote = currentNoteSelector(state);
		this._noteList = drawnNotesListSelector(state);
		this._saveNoteList = saveNoteListSelector(state);
		this._saveRelationsList = relationsSaveSelector(state);
		this._positionType = settingsSelector(state).positionType;
		this._dragNoteInfo = dragNoteInfoSelector(state);
	}

	firstUpdated() {
		store.dispatch(setCurrentNote());
	}

	newNote() {
		let title = window.prompt("Title", "somewhere");
		store.dispatch(addNote({title}));
		this.save();
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	handleDrop(event) {
		event.preventDefault();
		if (this._positionType === "absolute") {
			this.updateNotePosition(event.clientX, event.clientY);
		}
	}

	updateNotePosition(clientX, clientY) {
		let areaRect = this.shadowRoot.querySelector(".area").getBoundingClientRect();
		let xPos = (clientX - areaRect.left - this._dragNoteInfo.offsetX) / this.scale;
		let yPos = (clientY - areaRect.top - this._dragNoteInfo.offsetY) / this.scale;
		store.dispatch(setNotePosition(this._dragNoteInfo.id, xPos, yPos, 0));
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
		saveTreeRelations(this._saveRelationsList);
	}

	export() {
		let now = (new Date()).toUTCString().toLocaleLowerCase().replace(/\s|,|:/gm, "-");
		let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));
		makeDownload(`scales-${now}`, JSON.stringify(noteList));
	}
}

window.customElements.define("mind-map", MindMap);
