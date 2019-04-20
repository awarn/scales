import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { setNotePosition, getNotes } from "../actions/map";

import maps, { notesSelector } from "../reducers/map";
store.addReducers({
  maps
});

import { SharedStyles } from "./shared-styles.js";

class MapNote extends connect(store)(LitElement) {
	static get properties() {
    return {
      note: Object,
			x: Number,
			y: Number
    }
	}
	
	static get styles() {
    return [
			SharedStyles,
      css`
        :host {
					display: flex;
					position: fixed;
					padding: .25rem .5rem;
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

	handleDragEnd(event) {
    store.dispatch(setNotePosition(this.note, event.clientX, event.clientY, 0));
	}

	handleDragStart(event) {
		event.dataTransfer.setData("text/plain", this.note.id);
	}

	handleClick(event) {
		store.dispatch(getNotes(this.note.notes));
	}

	render() {
		return html`
			<style>
        :host {
					top: ${this.note.y}px;
					left: ${this.note.x}px;
        }
      </style>
			<div
				draggable="true"
				@dragend="${this.handleDragEnd}"
				@dragstart="${this.handleDragStart}"
				@click="${this.handleClick}">
				<p>${this.note.title}</p>
			</div>
		`;
	}
}

window.customElements.define('map-note', MapNote);
