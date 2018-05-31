import update from 'immutability-helper';

import {
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
});

const makeEmptyEditBoxForm = () => ({
  passcode: '',
});

const formsState = {
  newBox: makeEmptyNewBoxForm(),
  editBox: makeEmptyEditBoxForm(),
};

function resetForm(state, action) {
  switch (action.key) {
    case 'newBox':
      return update(state, {
        newBox: {$set: makeEmptyNewBoxForm()},
      });
    case 'editBox':
      return update(state, {
        editBox: {$set: makeEmptyEditBoxForm()},
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
    default:
      return state;
  }
}
