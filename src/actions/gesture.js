export const REGISTER_REGION = 'REGISTER_REGION';
export const BIND_GESTURE_LISTENER = 'BIND_GESTURE_LISTENER';
export const UNBIND_GESTURE_LISTENER = 'UNBIND_GESTURE_LISTENER';

export const registerRegion = (element) => {
  return {
		type: REGISTER_REGION,
		element
  };
};

export const bindGestureListener = (element, gesture, handler) => {
  return {
		type: BIND_GESTURE_LISTENER,
		element,
		gesture,
		handler
  };
};

export const unbindGestureListener = (element, gesture) => {
  return {
		type: UNBIND_GESTURE_LISTENER,
		element,
		gesture
  };
};
