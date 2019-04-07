/* export const CREATE = 'CREATE';
export const DESTROY = 'DESTROY'; */
export const GET_NOTES = 'GET_NOTES';
export const ADD_NOTE = 'ADD_NOTE';

const NOTE_LIST = [
  {"id": 1, "title": "Occam", "x": 10.99, "y": 2, "notes": [2,3,4,5]},
  {"id": 2, "title": "The High Forest", "x": 29.99, "y": 10},
  {"id": 3, "title": "Old Towers", "x": 8.99, "y": 5},
  {"id": 4, "title": "Mistvalley", "x": 24.99, "y": 7},
  {"id": 5, "title": "Red Larch", "x": 11.99, "y": 3},
  {"id": 5, "title": "Ashgard", "x": 11.99, "y": 3}
];

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

export const getNotes = (ids) => (dispatch) => {
  const notes = NOTE_LIST
    .reduce((obj, note) => {
      obj[note.id] = note
      return obj
    }, {})/* 
    .filter((note) => {
      if (!ids) {
        return true;
      }

      return ids.find(id => id === note.id);
    }); */

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
