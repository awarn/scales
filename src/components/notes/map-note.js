import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { moveNote, setCurrentNote, dragstartNote } from "../../actions/map";

import map, { settingsSelector, dragNoteSelector } from "../../reducers/map";
store.addReducers({
	map
});

import { SharedStyles } from "../shared-styles.js";

class MapNote extends connect(store)(LitElement) {
	static get properties() {
		return {
			note: Object,
			scale: Number,
			_positionType: String,
			_dragNote: Object
		}
	}

	static get styles() {
		return [
			SharedStyles,
			css`
				:host {
					display: flex;
					padding: .25rem;
				}
				.body {
					flex: 1 0 auto;
					padding: .25rem .5rem;
					white-space: nowrap;
					background: #fff;
					box-shadow: 0 0 .0625rem rgba(0,0,0,1);
				}
				p {
					margin: 0;
				}
			`
		];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<style>
				:host {
					position: ${this._positionType};
					${this._positionType === "absolute" ?
						`
							top: ${this.note.y * this.scale}px;
							left: ${this.note.x * this.scale}px;
						` : ""
					}
				}
			</style>
			<div
				draggable="true"
				@dragstart="${this.handleDragstart}"
				@drop="${this.handleDrop}"
				@dragover="${this.handleDragover}"
				@click="${this.handleClick}"
				class="body">
				<p>${this.note.title}</p>
			</div>
		`;
	}

	stateChanged(state) {
		this._positionType = settingsSelector(state).positionType;
		this._dragNote = dragNoteSelector(state);
	}

	handleDrop(event) {
		event.preventDefault();

		if (this._dragNote.id !== this.note.id) {
			store.dispatch(moveNote(this._dragNote.id, this.note.id, this._dragNote.parent));
		}
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	handleDragstart() {
		let rect = this.getBoundingClientRect();
		store.dispatch(dragstartNote(this.note.id, rect.width / 2, rect.height / 2));
	}

	handleClick() {
		store.dispatch(setCurrentNote(this.note.id));
	}
}

window.customElements.define('map-note', MapNote);
