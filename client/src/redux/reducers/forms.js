import update from 'immutability-helper';

import {EDIT_FORM_FIELD} from '../actions';

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

const formsState = {
  newBox: makeEmptyNewBoxForm(),
};

export default function forms(state = formsState, action) {
  switch (action.type) {
    case EDIT_FORM_FIELD:
      return update(state, {
        [action.form]: {[action.field]: {$set: action.value}},
      });
    default:
      return state;
  }
}
