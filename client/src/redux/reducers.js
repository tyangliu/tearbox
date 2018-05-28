import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import Fuse from 'fuse.js';
import cloneDeep from 'lodash.clonedeep';
import update from 'immutability-helper';

import {unpackItem} from './utils/box';

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

  EDIT_ADD_ITEM,
  EDIT_DELETE_ITEM,
  EDIT_MOVE_ITEM,

  EDIT_ADD_GROUP,
  EDIT_DELETE_GROUP,
  EDIT_MOVE_GROUP,

  EDIT_GROUP_TITLE,

  EDIT_ITEM_FIELD,
  SEARCH_ITEM_EFFECTS,

  END_DRAG,
} from './actions';

import {filterSortGroups, searchOpts} from './utils/box';
import {mergeEffects, effectsSearchOpts} from './utils/tears';

const tearsState = {
  colors: [],
  pieces: [],
  types: [],
  effects: [],
  filteredEffects: [],
  effectsIndex: null,
  effectsSearchTerm: '',
};

function tears(state = tearsState, action) {
  switch (action.type) {
    case RECEIVE_TEARS:
      return {
        ...action.data,
        filteredEffects: [],
        effectsIndex: new Fuse(mergeEffects(action.data.effects), effectsSearchOpts),
        effectsSearchTerm: '',
      };
    case SEARCH_ITEM_EFFECTS:
      const {effectsIndex} = state;
      const filteredEffects = effectsIndex && action.searchTerm.length
        ? effectsIndex.search(action.searchTerm).slice(0, 30)
        : [];
      return {
        ...state,
        filteredEffects,
        effectsSearchTerm: action.searchTerm,
      };
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
  stagingData: {},
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

const makeEmptyItem = () => ({
  id: null,
  color: {},
  color_id: null,
  effect_id: null,
  effect: {},
  piece_id: null,
  piece: {},
  type: {},
  rarity: {},
  note: '',
  created: null,
});

const makeEmptyGroup = () => ({
  id: null,
  label: '',
  items: [],
});

function updateItemField(state, action) {
  const {tears, groupIdx, itemIdx, key, value} = action; 
  const {stagingData} = state;
  const newItem = unpackItem(tears, {
    ...stagingData.groups[groupIdx].items[itemIdx],
    [key]: value,
  });

  return update(state, {stagingData: {
    groups: {[groupIdx]: {
      items: {[itemIdx]: {$set: newItem}},
    }},
  }});
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
        // Raw copy for staging edits.
        stagingData: cloneDeep(action.data),
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

    case EDIT_ADD_ITEM: 
      const emptyItem = makeEmptyItem();
      const len = (state.stagingData.groups && state.stagingData.groups[action.groupIdx].items)
        ? state.stagingData.groups[action.groupIdx].items.length
        : 0;
      if (len) {
        // Copy previous color for convenience
        const lastItem = state.stagingData.groups[action.groupIdx].items[len-1];
        emptyItem.color_id = lastItem.color_id;
        emptyItem.color = {
          ...lastItem.color,
        };
      }
      return update(state, {stagingData: {
        groups: {[action.groupIdx]: {
          items: {$push:[emptyItem]},
        }},
      }});
    case EDIT_DELETE_ITEM:
      return update(state, {stagingData: {
        groups: {[action.groupIdx]: {
          items: {$splice: [[action.itemIdx,1]]},
        }},
      }});
    case EDIT_MOVE_ITEM:
      const itemMoveTarget = state
        .stagingData
        .groups[action.groupIdx]
        .items[action.srcIdx];
      return update(state, {stagingData: {
        groups: {[action.groupIdx]: {
          items: {$splice: [[action.srcIdx,1], [action.destIdx,0,itemMoveTarget]]},
        }},
      }});

    case EDIT_ADD_GROUP:
      return update(state, {stagingData: {
        groups: {$push: [makeEmptyGroup()]},
      }});
    case EDIT_DELETE_GROUP:
      return update(state, {stagingData: {
        groups: {$splice: [[action.groupIdx,1]]},
      }});
    case EDIT_MOVE_GROUP:
      const groupMoveTarget = state.stagingData.groups[action.srcIdx];
      return update(state, {stagingData: {
        groups: {$splice: [[action.srcIdx,1], [action.destIdx,0,groupMoveTarget]]},
      }});

    case EDIT_GROUP_TITLE:
      return update(state, {stagingData: {
        groups: {[action.groupIdx]: {
          label: {$set: action.title},
        }},
      }});
    case EDIT_ITEM_FIELD:
      return updateItemField(
        state,
        action,
      ); 

    case END_DRAG:
      if (!action.result.destination) {
        return state;
      };

      const [draggableType, groupIdx] = action.result.type.split('_');
      const dragSrcIdx = action.result.source.index;
      const dragDestIdx = action.result.destination.index;

      switch (draggableType) {
        case 'ITEM': 
          const itemMoveTarget = state
            .stagingData
            .groups[groupIdx]
            .items[dragSrcIdx];
          return update(state, {stagingData: {
            groups: {[groupIdx]: {
              items: {$splice: [[dragSrcIdx,1], [dragDestIdx,0,itemMoveTarget]]},
            }},
          }});
        case 'GROUP':
          const groupMoveTarget = state
            .stagingData
            .groups[dragSrcIdx];
          const updateState = update(state, {stagingData: {
            groups: {$splice: [[dragSrcIdx,1], [dragDestIdx,0,groupMoveTarget]]},
          }});
          return updateState;
        default:
          return state;
      }
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

      return update(state, {
        groupVisibilities: {[idx]: {$set: !groupVisibilities[idx]}}
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
              [dragSrcIdx]: {$set: state.groupVisibilities[dragDestIdx]},
              [dragDestIdx]: {$set: state.groupVisibilities[dragSrcIdx]},
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

