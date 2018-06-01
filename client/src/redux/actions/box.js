import queryString from 'query-string';
import fetch from 'isomorphic-fetch';
import {push, replace} from 'react-router-redux';

import {RECEIVED, PREV_BOX_ID_KEY} from '../constants';
import {loadTears} from './tears';
import {unpackBox, packBox, processNewBox} from '../utils/box';

export const RESET_STAGING = 'RESET_STAGING';

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

const url = 'http://127.0.0.1:3000';
const boxesPath = 'boxes';

export const resetStaging = () => ({
  type: RESET_STAGING,
});

export const openEdit = id => (dispatch, getState) => {
  dispatch(resetStaging());
  dispatch(replace(`/box/${id}/edit`));
};

export const cancelEdit = id => (dispatch, getState) => {
  dispatch(resetStaging());
  dispatch(replace(`/box/${id}`));
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

export const patchBox = data => ({
  type: PATCH_BOX,
  data,
});

export const patchBoxSuccess = data => ({
  type: PATCH_BOX_SUCCESS,
  data,
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

export const requestGetBox = id => async (dispatch, getState) => {
  if (id === '') {
    dispatch(getBoxFailure('Not found'));
    return;
  }
  const tearsPromise = new Promise(async (resolve, reject) => { 
    if (getState().ui.tearStatus !== RECEIVED) {
      await dispatch(loadTears());
    }
    resolve();
  });
  dispatch(getBox(id));

  // Fetch box
  const fullUrl = `${url}/${boxesPath}/${id}`;
  const response = await fetch(fullUrl, {
    method: 'GET',
  });

  if (response.status !== 200) {
    dispatch(getBoxFailure('Not found'));
    return;
  }

  // Wait for tears before releasing result
  await tearsPromise; 
  const result = await response.json();
  const {tears} = getState();
  const box = unpackBox(tears, result);
  dispatch(getBoxSuccess(box));
};


export const requestPostBox = () => async (dispatch, getState) => {
  const form = getState().forms.newBox;
  const newBox = processNewBox(form);
  dispatch(postBox(newBox));
  
  const fullUrl = `${url}/${boxesPath}`;
  const response = await fetch(fullUrl, {
    method: 'POST',
    body: JSON.stringify(newBox),
  });

  // TODO: show error in UI
  if (response.status !== 200) {
    return;
  }

  const result = await response.json();
  const {tears} = getState();
  const box = unpackBox(tears, result);
  dispatch(postBoxSuccess(box));
  dispatch(push(`/box/${box.id}/edit`));
  localStorage && localStorage.setItem(PREV_BOX_ID_KEY, box.id);
};

export const requestPatchBox = () => async (dispatch, getState) => {
  const {box} = getState();
  const id = box.present.data.id;
  if (id === '') {
    return;
  }

  const data = packBox(box.present.stagingData);
  dispatch(patchBox(data));

  const fullUrl = `${url}/${boxesPath}/${id}`;
  const response = await fetch(fullUrl, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  // TODO: show error in UI
  if (response.status != 200) {
    return;
  }

  const result = await response.json();
  const {tears} = getState();
  const newBox = unpackBox(tears, result);
  dispatch(patchBoxSuccess(newBox));
  dispatch(replace(`/box/${id}`));
};
