import { LitElement, html, css } from "lit-element";

import { makeDownload } from "../utils/files.js";

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import { getNotes } from "../actions/map.js";

import maps, { noteListSelector } from "../reducers/map.js";
store.addReducers({
  maps
});

import "./map-note.js";

class MindMap extends connect(store)(LitElement) {
	static get properties() {
    return {
			_noteList: Array,
			_id: String,
			title: String
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
				${this._noteList.map((note) => {
					return html`
						<map-note
							.note="${note}"></map-note>
					`;
				})}
			</div>
			<div class="mind-map__actions">
				<button @click="${this.export}">Export</button>
				<button @click="${this.save}">Save</button>
			</div>
		`;
	}

	firstUpdated() {
    store.dispatch(getNotes());
  }

	stateChanged(state) {
		this._noteList = noteListSelector(state);
	}

	save() {
		localStorage.setItem("NOTE_LIST", JSON.stringify(this._noteList));
	}

	export() {
		let now = (new Date()).toUTCString().toLocaleLowerCase().replace(/\s|,|:/gm, "-");
		let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));
		makeDownload(`scales-${now}`, JSON.stringify(noteList))
	}
}

window.customElements.define("mind-map", MindMap);
