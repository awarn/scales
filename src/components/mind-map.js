import { LitElement, html, css } from "lit-element";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { getNotes } from "../actions/map.js";

import maps, { notesSelector } from "../reducers/map.js";
store.addReducers({
  maps
});

import "./map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
    return {
      _notes: { type: Array },
			_id: { type: String },
			title: { type: String }
    }
	}

	static get styles() {
    return [
      css`
        .mind-map {
					display: flex;
					position: relative;
					height: 100rem;
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
			<div class="mind-map">
				${Object.keys(this._notes).map((key) => {
					const item = this._notes[key];
					return html`
						<map-note
							title="${item.title}"
							text="${item.text}"
							x="${item.x}"
							y="${item.y}"></map-note>
					`;
				})}
			</div>
		`;
	}

	firstUpdated() {
    store.dispatch(getNotes());
  }

	stateChanged(state) {
		this._notes = notesSelector(state);
	}
}

window.customElements.define("mind-map", MindMap);
