import {
	GET_NOTES,
	ADD_NOTE,
	SET_NOTE_POSITION
} from '../actions/map.js';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
	maps: {},
	notes: {},
	error: ''
};

const maps = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_NOTES:
			return {
				...state,
				notes: action.notes
			};
		case ADD_NOTE:
		case SET_NOTE_POSITION:
			return {
				...state,
				notes: notes(state.notes, action),
				error: ''
			};
		default:
			return state;
	}
};

const notes = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case ADD_NOTE: {
			const noteId = action.noteId;
			return {
				...state,
				[noteId]: note(state[noteId], action)
			};
		}
		case SET_NOTE_POSITION: {
			const noteId = action.note.id;
			return {
				...state,
				[noteId]: note(state[noteId], action)
			};
		}
		default:
			return state;
	}
}

const note = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
			return state
		case SET_NOTE_POSITION:
			return {
				...state,
				x: action.x,
				y: action.y,
				z: action.z
			}
		default:
			return state;
	}
}

export default maps;

export const mapsSelector = state => state.maps.maps;

export const notesSelector = state => state.maps.notes;

export const noteListSelector = createSelector(
  notesSelector,
  (notes) => {
    return Object.keys(notes).map(id => {
			const item = notes[id];
			return {"id": item.id, "title": item.title, "x": item.x, "y": item.y, "notes": item.notes, "text": item.text}
    });
  }
);
