import {
	GET_NOTES,
	ADD_NOTE,
	SET_NOTE_POSITION,
	PUT_NOTE_IN,
	FILTER_NOTES
} from '../actions/map.js';
import { createSelector } from 'reselect';

const INITIAL_STATE = {
	maps: {},
	notes: {},
	noteFilter: [],
	error: ''
};

const maps = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case GET_NOTES:
			return {
				...state,
				notes: action.notes
			};
		case FILTER_NOTES:
			return {
				...state,
				noteFilter: action.ids
			}
		case ADD_NOTE:
		case SET_NOTE_POSITION:
		case PUT_NOTE_IN:
			return {
				...state,
				notes: notes(state.notes, action),
				error: ''
			};
		default:
			return state;
	}
}

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
		case PUT_NOTE_IN: {
			const parent = action.parent;
			return {
				...state,
				[parent]: note(state[parent], action)
			}
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
		case PUT_NOTE_IN:
			return {
				...state,
				notes: state.notes ? state.notes.concat([action.note]) : [action.note]
			};
		default:
			return state;
	}
}

export default maps;

export const mapsSelector = state => state.maps.maps;

export const notesSelector = state => state.maps.notes;

export const noteFilterSelector = state => state.maps.noteFilter;

export const noteListSelector = createSelector(
	notesSelector,
	noteFilterSelector,
  (notes, filterIDs) => {
		return Object.keys(notes)
		.filter(id => {
			if (!filterIDs || !filterIDs.length) {
				return true;
			}

			if (filterIDs.find(filterID => filterID === id)) {
				return true;
			}

			return false;
		})
		.map(id => {
			const item = notes[id];
			return {
				id: item.id,
				title: item.title,
				x: item.x,
				y: item.y,
				notes: item.notes,
				text: item.text
			}
    });
  }
);
