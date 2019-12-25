
function createId() {
	return Math.random();
}

export function createNote({
	title,
	text
}) {
	return {
		id: createId(),
		title,
		text,
		x: 0,
		y: 0
	}
}

export function createTreeRelation({
	parentId,
	childId
}) {
	return {
		id: createId(),
		parent: parentId,
		child: childId
	}
}

export function noteArrayToDictionary(notes) {
	return notes.reduce((obj, note) => {
		obj[note.id] = note
		return obj
	}, {});
}

function dictionaryToArray(dictionary) {
	return Object.values(dictionary);
}

export function noteDictionaryToArray(dictionary) {
	return dictionaryToArray(dictionary);
}

export function treeRelationDictionaryToArray(dictionary) {
	return dictionaryToArray(dictionary);
}
