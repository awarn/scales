import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { setNotePosition, putNoteIn, filterNotes } from "../actions/map";

import maps, { noteSettingsSelector } from "../reducers/map";
store.addReducers({
	maps
});

import { SharedStyles } from "./shared-styles.js";

class MapNote extends connect(store)(LitElement) {
	static get properties() {
		return {
			note: Object,
			scale: Number,
			xShift: Number,
			yShift: Number,
			_positionType: String
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
		store.dispatch(setNotePosition(this.note, xPos, yPos, 0));
	}

	handleDrop(event) {
		event.preventDefault();
		let noteId = event.dataTransfer.getData("text/plain");
		store.dispatch(putNoteIn(this.note.id, noteId));
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move"
	}

	handleDragend(event) {
		if (this._positionType === "absolute") {
			this.updatePosition(event.clientX, event.clientY);	
		}
	}

	handleDragstart(event) {
		event.dataTransfer.setData("text/plain", this.note.id);
	}

	handleClick(event) {
		store.dispatch(filterNotes(this.note.notes));
	}

	stateChanged(state) {
		this._positionType = noteSettingsSelector(state).positionType;
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
