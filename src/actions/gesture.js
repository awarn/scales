export const INIT_GESTURES = "INIT_GESTURES";
export const BIND_GESTURE_LISTENER = "BIND_GESTURE_LISTENER";
export const BIND_PAN_LISTENER = "BIND_PAN_LISTENER";
export const UNBIND_GESTURE_LISTENER = "UNBIND_GESTURE_LISTENER";

export const initGestures = (element, elementKey) => {
  return {
		type: INIT_GESTURES,
		element,
		elementKey
  };
};

export const bindGestureListener = (elementKey, gesture, handler) => {
  return {
		type: BIND_GESTURE_LISTENER,
		elementKey,
		gesture,
		handler
  };
};

export const bindPanListener = (elementKey, handler) => {
  return {
		type: BIND_PAN_LISTENER,
		elementKey,
		handler
  };
};

export const unbindGestureListener = (elementKey, gesture) => {
  return {
		type: UNBIND_GESTURE_LISTENER,
		elementKey,
		gesture
  };
};
