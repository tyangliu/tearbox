export const REQUEST_TEARS = 'REQUEST_TEARS';
export const RECEIVE_TEARS = 'RECEIVE_TEARS';

export function requestTears() {
  return {
    type: REQUEST_TEARS,
  };
}

export function receiveTears(data, index) {
  return {
    type: RECEIVE_TEARS,
    data,
    index,
  };
}

export function loadTears() {
  return async dispatch => {
    dispatch(requestTears());
    const indexPromise = import('../../data/effects_index.json');
    const dataPromise = import('../../data/tears.json');

    const index = await indexPromise;
    const data = await dataPromise;

    dispatch(receiveTears(data, index));
  };
}
