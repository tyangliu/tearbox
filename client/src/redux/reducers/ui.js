import update from 'immutability-helper';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,
  NOT_FOUND,

  REQUEST_TEARS,
  RECEIVE_TEARS,

  GET_BOX,
  GET_BOX_SUCCESS,
  GET_BOX_FAILURE,

  POST_BOX_SUCCESS,

  SET_COPIED,
  UNSET_COPIED,

  TOGGLE_GROUP,

  TOGGLE_FILTER_MENU,
  CLOSE_FILTER_MENU,

  OPEN_MODAL,
  CLOSE_MODAL,

  EDIT_DELETE_GROUP,
  END_DRAG,
} from '../actions';

const uiState = {
  tearsStatus: UNAVAILABLE,
  boxStatus: UNAVAILABLE,
  groupVisibilities: null,
  copied: false,
  filterVisibility: false,
  modalVisibilities: {
    newBox: false,
    editBox: false,
  },
};

function updateBoxProps(state, action) {
  return update(state, {
    boxStatus: {$set: RECEIVED},
    groupVisibilities: {$set: action.data.groups.map(() => true)},
    modalVisibilities: {newBox: {$set: false}},
  });
}

export default function ui(state = uiState, action) {
  switch (action.type) {
    case REQUEST_TEARS:
      return {...state, tearsStatus: REQUESTED};
    case RECEIVE_TEARS:
      return {...state, tearsStatus: RECEIVED};
    case GET_BOX:
      return {
        ...state,
        boxStatus: REQUESTED,
        groupVisibilities: null,
      };
    case GET_BOX_SUCCESS:
    case POST_BOX_SUCCESS:
      return updateBoxProps(state, action);
    case GET_BOX_FAILURE:
      return {...state, boxStatus: NOT_FOUND};
    case TOGGLE_GROUP:
      const {idx} = action;
      const {groupVisibilities} = state;
      if (!groupVisibilities || idx > groupVisibilities.length) {
        return state;
      }

      return update(state, {
        groupVisibilities: {[idx]: {$set: !groupVisibilities[idx]}}
      });
    case EDIT_DELETE_GROUP:
      return update(state, {
        groupVisibilities: {
          $splice: [[action.groupIdx,1]],
        },
      });
    case END_DRAG:
      if (!action.result.destination) {
        return state;
      };

      const [draggableType, groupIdx] = action.result.type.split('_');
      const dragSrcIdx = action.result.source.index;
      const dragDestIdx = action.result.destination.index;

      switch (draggableType) {
        case 'GROUP':
          return update(state, {
            groupVisibilities: {
              $splice: [[dragSrcIdx,1], [dragDestIdx,0,state.groupVisibilities[dragSrcIdx]]]
            },
          });
        default:
          return state;
      }
    case SET_COPIED:
      return {
        ...state,
        copied: true,
      };
    case UNSET_COPIED:
      return {
        ...state,
        copied: false,
      };
    case TOGGLE_FILTER_MENU:
      return {
        ...state,
        filterVisibility: !state.filterVisibility,
      };
    case CLOSE_FILTER_MENU:
      return {
        ...state,
        filterVisibility: false,
      };
    case OPEN_MODAL:
      return update(state, {
        modalVisibilities: {[action.key]: {$set: true}},
      });
    case CLOSE_MODAL:
      return update(state, {
        modalVisibilities: {[action.key]: {$set: false}},
      });
    default:
      return state;
  }
}
