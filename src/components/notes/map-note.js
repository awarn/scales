import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { moveNote, setCurrentNote, dragstartNote, setNotePosition } from "../../actions/map";
import { bindGestureListener, unbindGestureListener, initGestures, bindPanListener } from "../../actions/gesture";

import map, { settingsSelector, dragNoteSelector } from "../../reducers/map";
import gesture from "../../reducers/gesture";
store.addReducers({
	map,
	gesture
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

	firstUpdated() {
		store.dispatch(initGestures(this, "note-" + this.note.id));

		store.dispatch(bindPanListener("note-" + this.note.id, (event) => {
			if (this._positionType === "absolute") {
				if (event.isFinal) {
					console.log(event)
					let x = this.note.x + event.deltaX;
					let y = this.note.y + event.deltaY;
					this.updatePosition(x, y);
				}
			}
		}));
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
				@click="${this.handleClick}">
				<p>${this.note.title}</p>
			</div>
		`;
	}

	handleClick(event) {
		store.dispatch(setCurrentNote(this.note.id));
	}

	updatePosition(x, y) {
		let xPos = x / this.scale;
		let yPos = y / this.scale;
		store.dispatch(setNotePosition(this.note.id, xPos, yPos, 0));
	}

	/* handleDrop(event) {
		event.preventDefault();

		if (this._dragNote.id !== this.note.id) {
			store.dispatch(moveNote(this._dragNote.id, this.note.id, this._dragNote.parent));	
		}
	} 
	
	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	handleDragstart(event) {
		
	} */
}

window.customElements.define('map-note', MapNote);
