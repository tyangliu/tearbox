import update from 'immutability-helper';
import cloneDeep from 'lodash.clonedeep';

import {
  GET_BOX_SUCCESS,

  POST_BOX_SUCCESS,
  POST_BOX_FAILURE,
  POST_BOX_AUTH_FAILURE,

  PATCH_BOX_SUCCESS,

  PATCH_BOX_INFO_SUCCESS,
  PATCH_BOX_INFO_FAILURE,

  EDIT_FORM_FIELD,
  OPEN_MODAL,
} from '../actions';

const makeEmptyNewBoxForm = () => ({
  name: '',
  server: 'Solace',
  igns: '',
  discord: '',
  forum: '',
  other: '',
  passcode: '',
  passcodeReenter: '',
  email: '',
  rememberMe: true,
});

const makeEmptyEditBoxForm = () => ({
  passcode: '',
  rememberMe: true,
});

const makeBoxInfoForm = (data = {fields: []}) => {
  const form = {
    name: data.name || '',
    server: 'Solace',
    igns: '',
    discord: '',
    forum: '',
    other: '',
    oldPasscode: '',
    newPasscode: '',
    newPasscodeReenter: '',
    email: data.email || '',
  };
  data.fields.forEach(field => {
    form[field.label] = field.value;
  });
  return form;
};

const formsState = {
  newBox: makeEmptyNewBoxForm(),
  newBoxErrors: {},
  newBoxErrorMessage: null,

  editBox: makeEmptyEditBoxForm(),
  editBoxErrors: {},
  editBoxErrorMessage: null,

  boxInfoOrig: makeBoxInfoForm(),
  boxInfo: makeBoxInfoForm(),
  boxInfoErrors: {},
  boxInfoErrorMessage: null,
};

function resetForm(state, action) {
  switch (action.key) {
    case 'newBox':
      return update(state, {
        newBox: {$set: makeEmptyNewBoxForm()},
        newBoxErrors: {$set: {}},
        newBoxErrorMessage: {$set: null},
      });
    case 'editBox':
      return update(state, {
        editBox: {$set: makeEmptyEditBoxForm()},
        editBoxErrors: {$set: {}},
        editBoxErrorMessage: {$set: null},
      }); 
    case 'boxInfo':
      return update(state, {
        boxInfo: {$set: cloneDeep(state.boxInfoOrig)},
        boxInfoErrors: {$set: {}},
        boxInfoMessage: {$set: null},
      });
    default:
      return state;
  }
}

export default function forms(state = formsState, action) {
  switch (action.type) {
    case GET_BOX_SUCCESS:
    case POST_BOX_SUCCESS:
    case PATCH_BOX_SUCCESS:
    case PATCH_BOX_INFO_SUCCESS:
      return update(state, {
        boxInfoOrig: {$set: makeBoxInfoForm(action.data)},
        boxInfo: {$set: makeBoxInfoForm(action.data)},
        boxInfoErrors: {$set: {}},
        boxInfoMessage: {$set: null},
      });
    case EDIT_FORM_FIELD:
      return update(state, {
        [action.form]: {[action.field]: {$set: action.value}},
      });
    case OPEN_MODAL:
      return resetForm(state, action);
    case POST_BOX_AUTH_FAILURE:
      return update(state, {
        editBoxErrors: {$set: action.error.errors || {}},
        editBoxErrorMessage: {$set: action.error.message},
      });
    case POST_BOX_FAILURE:
      return update(state, {
        newBoxErrors: {$set: action.error.errors || {}},
        newBoxErrorMessage: {$set: action.error.message},
      });
    case PATCH_BOX_INFO_FAILURE:
      return update(state, {
        boxInfoErrors: {$set: action.error.errors || {}},
        boxInfoErrorMessage: {$set: action.error.message},
      });
    default:
      return state;
  }
}
