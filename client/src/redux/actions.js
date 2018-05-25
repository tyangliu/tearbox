import queryString from 'query-string';
import fetch from 'isomorphic-fetch';

import {unpackBox} from './utils/box';

export const UNAVAILABLE = 0;
export const REQUESTED = 1;
export const RECEIVED = 2;
export const NOT_FOUND = 3;

export const ASCENDING = 0;
export const DESCENDING = 1;

export const SEND_DATA = 'SEND_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';

export const REQUEST_TEARS = 'REQUEST_TEARS';
export const RECEIVE_TEARS = 'RECEIVE_TEARS';

export const REQUEST_BOX = 'REQUEST_BOX';
export const RECEIVE_BOX = 'RECEIVE_BOX';
export const RECEIVE_BOX_NOT_FOUND = 'RECEIVE_BOX_NOT_FOUND';

export const TOGGLE_GROUP = 'TOGGLE_GROUP';
export const SEARCH = 'SEARCH';

const url = 'http://127.0.0.1:8000';
const dataPath = '';

export function sendData(data) {
  return {
    type: SEND_DATA,
    data,
  };
}

export function receiveData(data) {
  return {
    type: RECEIVE_DATA,
    data,
  };
}

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
    const data = await import('../data/tears.json');
    dispatch(receiveTears(data));
  };
}

export function requestBox() {
  return {
    type: REQUEST_BOX,
  };
}

export function receiveBox(data) {
  return {
    type: RECEIVE_BOX,
    data,
  };
}

export function toggleGroup(idx) {
  return {
    type: TOGGLE_GROUP,
    idx,
  };
}

export function search(searchTerm) {
  return {
    type: SEARCH,
    searchTerm,
  };
}

const mockBox = {
  id: 'abc',
  name: 'Line',
  fields: [
    {label: 'Server', value: 'Solace'},
    {label: 'IGNs', value: 'Line, Pore, Pin'},
    {label: 'Discord', value: 'tom#1885'},
  ],
  note: 'The quick brown fox',
  groups: [
    {
      id: 123,
      label: 'Selling',
      items: [
        {id: 123, color_id: 0, effect_id: 10005, piece_id: 0, note: ''},
        {id: 123, color_id: 2, effect_id: 30054, piece_id: 3, note: ''},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: ''},
        {id: 123, color_id: 1, effect_id: 20046, piece_id: 1, note: ''},
      ],
    },
    {
      id: 456,
      label: 'Buying',
      items: [
        {id: 123, color_id: 0, effect_id: 10028, piece_id: 2, note: ''},
        {id: 123, color_id: 2, effect_id: 20054, piece_id: 3, note: ''},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: ''},
        {id: 123, color_id: 1, effect_id: 30046, piece_id: 1, note: ''},
      ],
    },
  ],
};

export function fetchBox() {
  return async (dispatch, getState) => {
    const tearsPromise = new Promise(async (resolve, reject) => { 
      if (getState().ui.tearStatus !== RECEIVED) {
        await dispatch(loadTears());
      }
      resolve();
    });

    dispatch(requestBox());

    // Fetch box

    // Wait for tears before releasing result
    await tearsPromise; 

    const {tears} = getState();
    const box = unpackBox(tears, mockBox);
    dispatch(receiveBox(box));
  };
}

export function postData(data) {
  const fullUrl = `${url}/${dataPath}`;
  return async dispatch => {
    dispatch(sendData(data));
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.status === 200) {
      dispatch(receiveData(result));
    }
  };
}
