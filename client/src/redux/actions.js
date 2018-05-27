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
export const TOGGLE_SORT = 'TOGGLE_SORT';

export const SET_COPIED = 'SET_COPIED';
export const UNSET_COPIED = 'UNSET_COPIED';

export const TOGGLE_FILTER_MENU = 'TOGGLE_FILTER_MENU';
export const CLOSE_FILTER_MENU = 'CLOSE_FILTER_MENU';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SELECT_ALL_FILTER = 'SELECT_ALL_FILTER';
export const UNSELECT_ALL_FILTER = 'UNSELECT_ALL_FILTER';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

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

export function toggleSort(key) {
  return {
    type: TOGGLE_SORT,
    key,
  };
}

export function setCopied() {
  return {
    type: SET_COPIED,
  };
}

export function unsetCopied() {
  return {
    type: UNSET_COPIED,
  };
}

export function toggleFilterMenu() {
  return {
    type: TOGGLE_FILTER_MENU,
  };
}

export function closeFilterMenu() {
  return {
    type: CLOSE_FILTER_MENU,
  };
}

export function toggleFilter(key, choice) {
  return {
    type: TOGGLE_FILTER,
    key,
    choice,
  };
}

export function selectAllFilter() {
  return {
    type: SELECT_ALL_FILTER,
  };
}

export function unselectAllFilter() {
  return {
    type: UNSELECT_ALL_FILTER,
  };
}

export function openModal(key) {
  return {
    type: OPEN_MODAL,
    key,
  };
}

export function closeModal(key) {
  return {
    type: CLOSE_MODAL,
    key,
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
        {id: 123, color_id: 0, effect_id: 10005, piece_id: 0, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 2, effect_id: 30054, piece_id: 3, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 20046, piece_id: 1, note: '', created: new Date().toISOString()},
      ],
    },
    {
      id: 456,
      label: 'Buying',
      items: [
        {id: 123, color_id: 0, effect_id: 10028, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 2, effect_id: 20054, piece_id: 3, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 30046, piece_id: 1, note: '', created: new Date().toISOString()},
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
