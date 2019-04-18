import { LitElement, html, css } from "lit-element";

class MapNote extends LitElement {
	static get properties() {
    return {
      notes: { type: Array },
			x: { type: Number },
			y: { type: Number },
			id: { type: String },
			title: { type: String },
			text: { type: String }
    }
	}
	
	static get styles() {
    return [
      css`
        .map-note {
					display: block;
					position: absolute;
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
        :host .map-note {
					top: ${this.y}%;
					left: ${this.x}%;
        }
      </style>
			<div class="map-note">
				<h2>${this.title}</h2>
				<div>${this.text}</div>
			</div>
		`;
	}
}

window.customElements.define('map-note', MapNote);
