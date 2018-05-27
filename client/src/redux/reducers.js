import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Fuse from 'fuse.js';
import cloneDeep from 'lodash.clonedeep';

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
  TOGGLE_SORT,

  SET_COPIED,
  UNSET_COPIED,

  TOGGLE_FILTER_MENU,
  CLOSE_FILTER_MENU,
  TOGGLE_FILTER,
  SELECT_ALL_FILTER,
  UNSELECT_ALL_FILTER,

  OPEN_MODAL,
  CLOSE_MODAL,
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

const filterSelectAll = {
  color:  [true, true, true],
  piece:  [true, true, true, true],
  type:   [true, true, true, true],
  rarity: [true, true], 
};

const filterUnselectAll = {
  color:  [false, false, false],
  piece:  [false, false, false, false],
  type:   [false, false, false, false],
  rarity: [false, false], 
};

const boxDisplayOptions = {
  sort: {
    key: null,
    order: ASCENDING,
  },
  filter: filterUnselectAll,
  searchTerm: '',
};

const boxState = {
  data: {},
  options: boxDisplayOptions,
};

function updateOptions(state, options) { 
  const newData = state.data.groups ? {
    ...state.data,
    groupDisplays: filterSortGroups(
      state.data.groups,
      state.data.groupIndices,
      options,
    ),
  } : {};

  return {
    ...state,
    data: newData,
    options,
  };
}


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
      const optionsWithNewSearch = {
        ...state.options,
        searchTerm: action.searchTerm,
      };
      return updateOptions(state, optionsWithNewSearch);
    case TOGGLE_SORT:
      const {sort} = state.options;
      const newSort = {};
      if (
        action.key == sort.key &&
        ((sort.order == ASCENDING && action.key != 'created') ||
         (sort.order == DESCENDING && action.key == 'created'))
      ) {
        newSort.key = action.key;
        newSort.order = !sort.order;
      } else if (action.key == sort.key) {
        newSort.key = null,
        newSort.order = ASCENDING;
      } else {
        newSort.key = action.key;
        newSort.order = action.key == 'created' ? DESCENDING : ASCENDING;
      }
      const optionsWithNewSort = {
        ...options,
        sort: newSort,
      };
      return updateOptions(state, optionsWithNewSort);
    case TOGGLE_FILTER:
      const {filter} = state.options;
      const newFilter = cloneDeep(filter);
      newFilter[action.key][action.choice] = !filter[action.key][action.choice];
      return updateOptions(state, {...options, filter: newFilter});
    case SELECT_ALL_FILTER:
      return updateOptions(state, {...options, filter: filterSelectAll});
    case UNSELECT_ALL_FILTER: 
      return updateOptions(state, {...options, filter: filterUnselectAll});
    default:
      return state;
  }
}


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
      return {
        ...state,
        modalVisibilities: {
          ...state.modalVisibilities,
          [action.key]: true,
        },
      };
    case CLOSE_MODAL:
      return {
        ...state,
        modalVisibilities: {
          ...state.modalVisibilities,
          [action.key]: false,
        },
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

