export const REQUEST_TEARS = 'REQUEST_TEARS';
export const RECEIVE_TEARS = 'RECEIVE_TEARS';

export function requestTears() {
  return {
    type: REQUEST_TEARS,
  };
}

export function receiveTears(data) {
  return {
    type: RECEIVE_TEARS,
    data,
  };
}

export function loadTears() {
  return async dispatch => {
    dispatch(requestTears());
    const data = await import('../../data/tears.json');
    dispatch(receiveTears(data));
  };
}
