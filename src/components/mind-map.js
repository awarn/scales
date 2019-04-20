import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { getNotes } from "../actions/map.js";

import maps, { notesSelector, noteListSelector } from "../reducers/map.js";
store.addReducers({
  maps
});

import "./map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
    return {
			_notes: { type: Array },
			_noteList: Array,
			_id: { type: String },
			title: { type: String }
    }
	}

	static get styles() {
    return [
      css`
        :host {
					display: flex;
					flex-flow: column;
				}
				.mind-map__actions {
					position: fixed;
					right: 0;
					bottom: 0;
					height: 3rem;
					padding: 0 1rem 1rem 0;
				}
				.mind-map__area {
					position: relative;
					height: calc(100vh - 4rem);
					width: 100%;
				}
      `
    ];
  }

	constructor() {
		super();
	}

	render() {
		return html`
			<div class="mind-map__area">
				${Object.keys(this._notes).map((key) => {
					const item = this._notes[key];
					return html`
						<map-note
							.note="${item}"></map-note>
					`;
				})}
			</div>
			<div class="mind-map__actions">
				<button @click="${this.save}">Save</button>
			</div>
		`;
	}

	firstUpdated() {
    store.dispatch(getNotes());
  }

	stateChanged(state) {
		this._notes = notesSelector(state);
		this._noteList = noteListSelector(state);
	}

	save() {
		localStorage.setItem("NOTE_LIST", JSON.stringify(this._noteList));
	}
}

window.customElements.define("mind-map", MindMap);
