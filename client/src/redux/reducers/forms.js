import update from 'immutability-helper';

import {
  POST_BOX_FAILURE,
  POST_BOX_AUTH_FAILURE,

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

const formsState = {
  newBox: makeEmptyNewBoxForm(),
  newBoxErrors: {},
  newBoxErrorMessage: null,
  editBox: makeEmptyEditBoxForm(),
  editBoxErrors: {},
  editBoxErrorMessage: null,
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
    default:
      return state;
  }
}

export default function forms(state = formsState, action) {
  switch (action.type) {
    case EDIT_FORM_FIELD:
      return update(state, {
        [action.form]: {[action.field]: {$set: action.value}},
      });
    case OPEN_MODAL:
      return resetForm(state, action);
    case POST_BOX_FAILURE:
      return update(state, {
        newBoxErrors: {$set: action.error.errors || {}},
        newBoxErrorMessage: {$set: action.error.message},
      });
    case POST_BOX_AUTH_FAILURE:
      return update(state, {
        editBoxErrors: {$set: action.error.errors || {}},
        editBoxErrorMessage: {$set: action.error.message},
      });
    default:
      return state;
  }
}
