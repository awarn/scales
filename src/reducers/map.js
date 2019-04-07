
import {
	GET_NOTES,
	ADD_NOTE
} from '../actions/map.js';

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
			return {
				...state,
				notes: notes(state.notes, action),
				error: ''
			};
		default:
			return state;
	}
};

const notes = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
			const noteId = action.noteId;
			return {
				...state,
				[noteId]: note(state[noteId], action)
			};
		default:
			return state;
	}
}

const note = (state, action) => {
	switch (action.type) {
		case ADD_NOTE:
			return state
		default:
			return state;
	}
}

export default maps

export const mapsSelector = state => state.maps.maps;
export const notesSelector = state => state.maps.notes;
