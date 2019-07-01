export const initHammer = (element, options = undefined) => {
	return new Hammer(element, options);
}

export const addPanListener = (hammerInstance, listener) => {
	hammerInstance.get("pan").set({ direction: Hammer.DIRECTION_ALL });
	return addGestureListener(hammerInstance, "pan", listener);
}

export const addGestureListener = (hammerInstance, gesture, listener) => {
	return hammerInstance.on(gesture, listener);
}

export const removeGestureListener = (hammerInstance, gesture) => {
	return hammerInstance.off(gesture);
}
