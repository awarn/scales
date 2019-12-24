import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../store.js';

import { toggleEditorCollapse } from "../../actions/editor.js";
import { setCurrentNote, moveNote, setNoteText } from "../../actions/map.js";

import editor, { isCollapsedSelector } from "../../reducers/editor.js";
import map, { currentNoteSelector, currentNoteParentSelector, dragNoteSelector } from "../../reducers/map";
store.addReducers({
	map, editor
});

import { SharedStyles } from "../shared-styles.js";

import "../editors/markdown-editor.js";

class CurrentNote extends connect(store)(LitElement) {
	static get properties() {
		return {
			note: Object,
			parentNote: Object,
			_dragNote: Object,
			_editedText: String,
			isEditorCollapsed: Boolean
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
					width: 100%;
					background: #fff;
					flex-flow: column;
				}

				.actions {
					flex: 1 0 auto;
					justify-content: flex-end;
				}

				@media (min-width: 640px) {
					.editor-toggle {
						display: none;
					}
				}

				.header {
					display: flex;
					height: 3rem;
					width: 100%;
					flex-flow: row;
				}

				.info {
					display: flex;
					flex: 3 0 auto;
					flex-flow: column;
				}

				.part {
					display: flex;
					padding: .5rem;
				}

				.title {
					font-size: 1.25rem;
					font-weight: bold;
				}
			`
		];
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<header class="header">
				<div class="info part">
					<div class="title">${this.note.title}</div>
				</div>
				<div class="actions part">
					${this.parentNote ? html`
						<button
							@drop="${this.handleDrop}"
							@dragover="${this.handleDragover}"
							@click="${this.setParentAsCurrent}">${this.parentNote.title}</button>` : ""
					}
					<button
						@click="${this.toggleEditor}"
						class="editor-toggle">${this.isEditorCollapsed ? "more" : "less"}</button>
				</div>
			</header>
			<markdown-editor
				.text=${this.note.text}
				@text-changed=${this._textChanged}></markdown-editor>
		`;
	}

	stateChanged(state) {
		this.note = currentNoteSelector(state);
		this._dragNote = dragNoteSelector(state);
		if (this.note) {
			this.parentNote = currentNoteParentSelector(state);
		}
		this.isEditorCollapsed = isCollapsedSelector(state);
	}

	_textChanged(e) {
		store.dispatch(setNoteText(this.note.id, e.detail.text));
	}

	setParentAsCurrent() {
		store.dispatch(setCurrentNote(this.parentNote.id));
	}

	toggleEditor() {
		store.dispatch(toggleEditorCollapse(!this.isEditorCollapsed));
	}

	handleDrop(event) {
		event.preventDefault();
		store.dispatch(moveNote(this._dragNote.id, this.parentNote.id));
	}

	handleDragover(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	}
}

window.customElements.define('current-note', CurrentNote);
