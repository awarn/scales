export const SET_CURRENT_NOTE = "SET_CURRENT_NOTE";
export const SET_DRAWN_NOTES = "SET_DRAWN_NOTES";
export const GET_NOTES = "GET_NOTES";
export const SET_NOTE_POSITION = "SET_NOTE_POSITION";
export const MOVE_NOTE = "MOVE_NOTE";
export const ADD_NOTE = "ADD_NOTE";
export const FILTER_NOTES = "FILTER_NOTES";
export const UPDATE_NOTE_POSITION_TYPE = "UPDATE_NOTE_POSITION_TYPE";
export const DRAGSTART_NOTE = "DRAGSTART_NOTE";
export const SET_NOTE_TEXT = "SET_NOTE_TEXT";

const NOTE_LIST = [
	{"id": "1", "title": "Occam", "x": 10.99, "y": 200, "notes": ["2","3","4","5"], "text": "bla"},
	{"id": "2", "title": "The High Forest", "x": 29.99, "y": 240, "parent": "1"},
	{"id": "3", "title": "Old Towers", "x": 8.99, "y": 280, "parent": "1"},
	{"id": "4", "title": "Mistvalley", "x": 24.99, "y": 320, "parent": "1"},
	{"id": "5", "title": "Red Larch", "x": 11.99, "y": 360, "parent": "1"},
	{"id": "6", "title": "Ashgard", "x": 11.99, "y": 400}
];

function _getNotes(ids) {
	let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (!noteList || noteList.length === 0) {
		noteList = NOTE_LIST;
	}

	if (!ids) {
		return noteList
			.filter(note => note.parent === undefined);
	}
	else {
		return noteList
			.filter(note => {
				return ids.find(id => id === note.id);
			});
	}
}

export const getNotes = (ids = []) => (dispatch) => {
	const notes = _getNotes(ids)
		.reduce((obj, note) => {
			obj[note.id] = note
			return obj
		}, {});

	dispatch({
		type: GET_NOTES,
		notes
	});
}

export const setCurrentNote = (id) => (dispatch) => {
	const note = _getNotes(id ? [id] : null)[0];

	dispatch({
		type: SET_CURRENT_NOTE,
		note
	});

	dispatch(setDrawnNotes(note.notes));
}

export const setDrawnNotes = (ids = []) => (dispatch) => {
	let notes = _getNotes(ids)
		.reduce((obj, note) => {
			obj[note.id] = note
			return obj
		}, {});

	dispatch({
		type: SET_DRAWN_NOTES,
		notes
	});
}

export const saveNotes = (notes) => {
	let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (noteList && noteList.length) {
		noteList = noteList.map(listNote => {
			return notes.reduce((prev, note) => {
				if (listNote.id === note.id) {
					return note;
				}
				return prev;
			}, listNote); 
		});

		localStorage.setItem("NOTE_LIST", JSON.stringify(noteList));
	}
	else {
		localStorage.setItem("NOTE_LIST", JSON.stringify(NOTE_LIST));
		saveNotes(notes);
	}
}

export const setNotePosition = (noteID, x, y, z) => {
	return {
		type: SET_NOTE_POSITION,
		noteID,
		x,
		y,
		z
	}
}

export const moveNote = (noteID, newParentID, oldParentID) => {
	return {
		type: MOVE_NOTE,
		noteID,
		newParentID,
		oldParentID
	}
}

export const addNote = (note) => {
	return {
		type: ADD_NOTE,
		note
	};
}

export const updateNotePositionType = (positionType) => {
	return {
		type: UPDATE_NOTE_POSITION_TYPE,
		positionType
	}
}

export const dragstartNote = (noteID, offsetX, offsetY) => {
	return {
		type: DRAGSTART_NOTE,
		noteID,
		offsetX,
		offsetY
	}
}

export const setNoteText = (noteID, text) => {
	return {
		type: SET_NOTE_TEXT,
		noteID,
		text
	}
}
