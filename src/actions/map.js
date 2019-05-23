export const SET_NOTE = "SET_NOTE";
export const GET_NOTES = "GET_NOTES";
export const ADD_NOTE = "ADD_NOTE";
export const SET_NOTE_POSITION = "SET_NOTE_POSITION";
export const MOVE_NOTE = "MOVE_NOTE";
export const FILTER_NOTES = "FILTER_NOTES";
export const UPDATE_NOTE_POSITION_TYPE = "UPDATE_NOTE_POSITION_TYPE";

const NOTE_LIST = [
	{"id": "1", "title": "Occam", "x": 10.99, "y": 200, "notes": ["2","3","4","5"], "text": "bla"},
	{"id": "2", "title": "The High Forest", "x": 29.99, "y": 240, "parent": "1"},
	{"id": "3", "title": "Old Towers", "x": 8.99, "y": 280, "parent": "1"},
	{"id": "4", "title": "Mistvalley", "x": 24.99, "y": 320, "parent": "1"},
	{"id": "5", "title": "Red Larch", "x": 11.99, "y": 360, "parent": "1"},
	{"id": "6", "title": "Ashgard", "x": 11.99, "y": 400}
];

function _getNotes(ids = []) {
	let noteList = JSON.parse(localStorage.getItem("NOTE_LIST"));

	if (!noteList || noteList.length === 0) {
		noteList = NOTE_LIST;
	}

	let notes = noteList
		.filter((note) => {
			return ids.find(id => id === note.id);
		});

	if (notes.length === 0) {
		notes = [noteList.find(note => note.id === "1")];
	}

	return notes;
}

export const getNotes = (ids = []) => (dispatch) => {
	let notes = _getNotes(ids)
		.reduce((obj, note) => {
			obj[note.id] = note
			return obj
		}, {});

	dispatch({
		type: GET_NOTES,
		notes
	});
}

export const setNote = (id) => (dispatch) => {
	let note = _getNotes([id])[0];

	dispatch({
		type: SET_NOTE,
		note: note
	});

	if (note.notes) {
		let childNotes = _getNotes(note.notes);

		dispatch({
			type: GET_NOTES,
			notes: childNotes.reduce((obj, note) => {
					obj[note.id] = note
					return obj
				}, {})
		}); 
	}
	else {
		dispatch({
			type: GET_NOTES,
			notes: {}
		}); 
	}
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

export const setNotePosition = (note, x, y, z) => {
	return {
		type: SET_NOTE_POSITION,
		note,
		x,
		y,
		z
	}
}

export const moveNote = (parent, note) => {
	return {
		type: MOVE_NOTE,
		parent,
		note
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
