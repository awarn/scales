/* export const CREATE = 'CREATE';
export const DESTROY = 'DESTROY'; */
//export const SET_MAP_MODE = "SET_MAP_MODE";
export const GET_NOTES = "GET_NOTES";
export const ADD_NOTE = "ADD_NOTE";
export const SET_NOTE_POSITION = "SET_NOTE_POSITION";

let NOTE_LIST = [
  {"id": 1, "title": "Occam", "x": 10.99, "y": 200, "notes": [2,3,4,5], "text": "bla"},
  {"id": 2, "title": "The High Forest", "x": 29.99, "y": 240},
  {"id": 3, "title": "Old Towers", "x": 8.99, "y": 280},
  {"id": 4, "title": "Mistvalley", "x": 24.99, "y": 320},
  {"id": 5, "title": "Red Larch", "x": 11.99, "y": 360},
  {"id": 5, "title": "Ashgard", "x": 11.99, "y": 400}
];

export const setNotePosition = (note, x, y, z) => {
  return {
    type: SET_NOTE_POSITION,
    note,
    x,
    y,
    z
  }
}

export const getNotes = (ids) => (dispatch) => {
  let notes = NOTE_LIST
    .filter((note) => {
      if (!ids) {
        return true;
      }

      return ids.find(id => id === note.id);
    })
    .reduce((obj, note) => {
      obj[note.id] = note
      return obj
    }, {})

  dispatch({
    type: GET_NOTES,
    notes
  });
};

export const addNote = (note) => {
  return {
    type: ADD_NOTE,
    note
  };
};

/* export const create = () => {
  return {
    type: CREATE
  };
};

export const destroy = () => {
  return {
    type: DESTROY
  };
}; */

/* export const setMapMode = (mode) => {
  return {
    type: SET_MAP_MODE,
    mode
  }
} */
