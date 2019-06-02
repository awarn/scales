import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { setCurrentNote, moveNote, setNotePosition } from "../../actions/map.js";

import map, { currentNoteSelector, currentNoteParentSelector, dragNoteSelector } from "../../reducers/map";
store.addReducers({
	map
});

import { SharedStyles } from "../shared-styles.js";

class CurrentNote extends connect(store)(LitElement) {
	static get properties() {
		return {
			note: Object,
			parentNote: Object,
			_dragNote: Object
		}
	}

	static get styles() {
		return [
			SharedStyles,
			css`
				:host {
					display: flex;
					top: 0;
					right: 0;
					height: 4rem;
					width: 100%;
					flex-flow: row;
					background: #fff;
				}
				.part {
					display: flex;
					padding: .25rem .5rem;
					box-shadow: 0 0 .0625rem rgba(0,0,0,1);
				}
				.actions {
					flex: 1 0 auto;
				}
				.info {
					display: flex;
					flex: 3 0 auto;
					flex-flow: column;
				}
			`
		];
	}

	constructor() {
		super();
	}

	setParentAsCurrent() {
		store.dispatch(setCurrentNote(this.note.parent));
	}

	handleDrop(event) {
		event.preventDefault();
		store.dispatch(moveNote(this._dragNote.id, this.note.parent, this._dragNote.parent));
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}

	stateChanged(state) {
		this.note = currentNoteSelector(state);
		this._dragNote = dragNoteSelector(state);
		if (this.note) {
			this.parentNote = currentNoteParentSelector(state);
		}
	}

	render() {
		return html`
			<div class="info part">
				<div>${this.note.title}</div>
				<div>${this.note.text}</div>
			</div>
			<div class="actions part">
				${this.parentNote ? html`
					<button
						@drop="${this.handleDrop}"
						@dragover="${this.handleDragover}"
						@click="${this.setParentAsCurrent}">${this.parentNote.title}</button>` : ""
				}
			</div>
		`;
	}
}

window.customElements.define('current-note', CurrentNote);
