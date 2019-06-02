import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { setNotePosition, moveNote, setCurrentNote, dragstartNote } from "../../actions/map";

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
			xShift: Number,
			yShift: Number,
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
				:host > div {
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

	updatePosition(clientX, clientY) {
		let xPos = (clientX - this.xShift - this.clientWidth / 2) / this.scale;
		let yPos = (clientY - this.yShift - this.clientHeight / 2) / this.scale;
		store.dispatch(setNotePosition(this._dragNote.id, xPos, yPos, 0));
	}

	handleDrop(event) {
		event.preventDefault();
		store.dispatch(moveNote(this._dragNote.id, this.note.id, this._dragNote.parent));
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	handleDragend(event) {
		event.preventDefault();
		if (this._positionType === "absolute") {
			this.updatePosition(event.clientX, event.clientY);
		}
	}

	handleDragstart(event) {
		store.dispatch(dragstartNote(this.note.id));
	}

	handleClick(event) {
		store.dispatch(setCurrentNote(this.note.id));
	}

	stateChanged(state) {
		this._positionType = settingsSelector(state).positionType;
		this._dragNote = dragNoteSelector(state);
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
				@dragend="${this.handleDragend}"
				@dragstart="${this.handleDragstart}"
				@drop="${this.handleDrop}"
				@dragover="${this.handleDragover}"
				@click="${this.handleClick}">
				<p>${this.note.title}</p>
			</div>
		`;
	}
}

window.customElements.define('map-note', MapNote);
