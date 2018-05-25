import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

import Fuse from 'fuse.js';

import {
  UNAVAILABLE,
  REQUESTED,
  RECEIVED,
  NOT_FOUND,

  ASCENDING,
  DESCENDING,

  REQUEST_TEARS,
  RECEIVE_TEARS,

  REQUEST_BOX,
  RECEIVE_BOX,
  RECEIVE_BOX_NOT_FOUND,

  TOGGLE_GROUP,
  SEARCH,
} from './actions';

import {filterSortGroups, searchOpts} from './utils/box';

const tearsState = {
  colors: [],
  pieces: [],
  types: [],
  effects: [],
};

function tears(state = tearsState, action) {
  switch (action.type) {
    case RECEIVE_TEARS:
      return action.data;
    default:
      return state;
  }
}

const boxDisplayOptions = {
  sort: {
    key: 'color',
    order: ASCENDING,
  },
  filter: {
  },
  searchTerm: '',
};

const boxState = {
  data: {},
  options: boxDisplayOptions,
};


function box(state = boxState, action) {
  const {options} = state;
  switch (action.type) {
    case REQUEST_BOX:
      return {
        ...state,
        data: {},
      };
    case RECEIVE_BOX:
      const {groups} = action.data;
      const groupIndices = (groups || []).map(group => new Fuse(
        group.items,
        searchOpts,
      ));
      return {
        ...state,
        data: {...action.data,
          groupDisplays: filterSortGroups(groups, groupIndices, options),
          groupIndices,
        },
      }; 
    case SEARCH:
      const newOptions = {
        ...state.options,
        searchTerm: action.searchTerm,
      };
      const newData = state.data.groups ? {
        ...state.data,
        groupDisplays: filterSortGroups(
          state.data.groups,
          state.data.groupIndices,
          newOptions,
        ),
      } : {};

      return {
        ...state,
        data: newData,
        options: newOptions,
      };
    default:
      return state;
  }
}


const uiState = {
  tearsStatus: UNAVAILABLE,
  boxStatus: UNAVAILABLE,
  groupVisibilities: null,
};

function ui(state = uiState, action) {
  switch (action.type) {
    case REQUEST_TEARS:
      return {...state, tearsStatus: REQUESTED};
    case RECEIVE_TEARS:
      return {...state, tearsStatus: RECEIVED};
    case REQUEST_BOX:
      return {
        ...state,
        boxStatus: REQUESTED,
        groupVisibilities: null,
      };
    case RECEIVE_BOX:
      return {
        ...state,
        boxStatus: RECEIVED,
        groupVisibilities: action.data.groups.map(() => true),
      };
    case RECEIVE_BOX_NOT_FOUND:
      return {...state, boxStatus: NOT_FOUND};
    case TOGGLE_GROUP:
      const {idx} = action;
      const {groupVisibilities} = state;
      if (!groupVisibilities || idx > groupVisibilities.length) {
        return state;
      }

      return {
        ...state,
        groupVisibilities: [
          ...groupVisibilities.slice(0, idx),
          !groupVisibilities[idx],
          ...groupVisibilities.slice(idx+1),
        ],
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  tears,
  box,
  ui,
  routing: routerReducer,
});

export default rootReducer;

