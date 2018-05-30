import queryString from 'query-string';
import fetch from 'isomorphic-fetch';

import {RECEIVED} from './constants';
import {loadTears} from './tears';
import {unpackBox, processNewBox} from '../utils/box';

export const GET_BOX = 'GET_BOX';
export const GET_BOX_SUCCESS = 'GET_BOX_SUCCESS';
export const GET_BOX_FAILURE = 'GET_BOX_FAILURE';

export const POST_BOX = 'POST_BOX';
export const POST_BOX_SUCCESS = 'POST_BOX_SUCCESS';
export const POST_BOX_FAILURE = 'POST_BOX_FAILURE';

export const PATCH_BOX = 'PATCH_BOX';
export const PATCH_BOX_SUCCESS = 'PATCH_BOX_SUCCESS';
export const PATCH_BOX_FAILURE = 'PATCH_BOX_FAILURE';

export const DELETE_BOX = 'DELETE_BOX';
export const DELETE_BOX_SUCCESS = 'DELETE_BOX_SUCCESS';
export const DELETE_BOX_FAILURE = 'DELETE_BOX_FAILURE';

const url = 'http://127.0.0.1:3000/';
const boxesPath = 'boxes/';

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
      type: {id: 0, label: 'Selling'},
      label: 'Cool Tears',
      items: [
        {id: 123, color_id: 0, effect_id: 10005, piece_id: 0, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 2, effect_id: 30054, piece_id: 3, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 20046, piece_id: 1, note: '', created: new Date().toISOString()},
      ],
    },
    {
      id: 456,
      type: {id: 1, label: 'Buying'},
      label: 'Am Poor',
      items: [
        {id: 123, color_id: 0, effect_id: 10028, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 2, effect_id: 20054, piece_id: 3, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 30046, piece_id: 1, note: '', created: new Date().toISOString()},
      ],
    },
    {
      id: 678,
      type: {id: 1, label: 'Selling'},
      label: '',
      items: [
        {id: 123, color_id: 0, effect_id: 10028, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 2, effect_id: 20054, piece_id: 3, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 40023, piece_id: 2, note: '', created: new Date().toISOString()},
        {id: 123, color_id: 1, effect_id: 30046, piece_id: 1, note: '', created: new Date().toISOString()},
      ],
    },
  ],
};

export const getBox = id => ({
  type: GET_BOX,
  id,
});

export const getBoxSuccess = data => ({
  type: GET_BOX_SUCCESS,
  data,
});

export const getBoxFailure = (error) => ({
  type: GET_BOX_FAILURE,
  error,
});

export const postBox = data => ({
  type: POST_BOX,
  data,
});

export const postBoxSuccess = data => ({
  type: POST_BOX_SUCCESS,
  data,
});

export const postBoxFailure = error => ({
  type: POST_BOX_FAILURE,
  error,
});

export const patchBox = () => ({
  type: PATCH_BOX,
});

export const patchBoxSuccess = data => ({
  type: PATCH_BOX_SUCCESS,
});

export const patchBoxFailure = error => ({
  type: PATCH_BOX_FAILURE,
  error,
});

export const deleteBox = () => ({
  type: DELETE_BOX,
});

export const deleteBoxSuccess = () => ({
  type: DELETE_BOX_SUCCESS,
});

export const deleteBoxFailure = error => ({
  type: DELETE_BOX_FAILURE,
  error,
});

export const requestGetBox = () => async (dispatch, getState) => {
  const tearsPromise = new Promise(async (resolve, reject) => { 
    if (getState().ui.tearStatus !== RECEIVED) {
      await dispatch(loadTears());
    }
    resolve();
  });

  dispatch(getBox());

  // Fetch box

  // Wait for tears before releasing result
  await tearsPromise; 

  const {tears} = getState();
  const box = unpackBox(tears, mockBox);
  dispatch(getBoxSuccess(box));
};


export const requestPostBox = () => async (dispatch, getState) => {
  const fullUrl = `${url}/${boxesPath}`;

  const form = getState().forms.newBox;
  const newBox = processNewBox(form);

  dispatch(postBox(newBox));
  
  const response = await fetch(fullUrl, {
    method: 'POST',
    body: JSON.stringify(newBox),
  });

  if (response.status === 200) {
    const result = await response.json();
    dispatch(postBoxSuccess(result));    
  }
};
