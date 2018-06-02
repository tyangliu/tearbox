import undoable, {includeAction, groupByActionTypes} from 'redux-undo';
import Fuse from 'fuse.js';
import cloneDeep from 'lodash.clonedeep';
import update from 'immutability-helper';
import omit from 'lodash.omit';

import {
  ASCENDING,
  DESCENDING,

  RESET_STAGING,

  GET_BOX,
  GET_BOX_SUCCESS,
  GET_BOX_FAILURE,

  POST_BOX_SUCCESS,
  PATCH_BOX_SUCCESS,
  PATCH_BOX_INFO_SUCCESS,

  SEARCH,
  TOGGLE_GROUP,
  TOGGLE_SORT,
  TOGGLE_FILTER,
  SELECT_ALL_FILTER,
  UNSELECT_ALL_FILTER,

  EDIT_ADD_ITEM,
  EDIT_DELETE_ITEM,
  EDIT_MOVE_ITEM,

  EDIT_ADD_GROUP,
  EDIT_DELETE_GROUP,
  EDIT_MOVE_GROUP,

  EDIT_GROUP_TITLE,
  EDIT_GROUP_TYPE,

  EDIT_ITEM_FIELD,
  EDIT_ITEM_FIELD_BATCHED,
  SEARCH_ITEM_EFFECTS,
  END_DRAG,
} from '../actions';
import {unpackItem, filterSortGroups, searchOpts} from '../utils/box';

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


const makeEmptyItem = idx => ({
  idx,
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

const makeEmptyGroup = idx => ({
  idx,
  nextItemIdx: 0,
  id: null,
  name: '',
  type: 0,
  items: [],
});

const updateOptions = (state, options) => { 
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
};

function updateItemField(state, action) {
  const {tears, groupIdx, itemIdx, key, value} = action; 
  const {stagingData} = state;
  const newItem = unpackItem(tears, {
    ...stagingData.groups[groupIdx].items[itemIdx],
    [key]: value,
  });

  return update(state, {stagingData: {
    isDirty: {$set: true},
    groups: {[groupIdx]: {
      items: {[itemIdx]: {$set: newItem}},
    }},
  }});
}

function copyToStaging(state) {
  const newStagingData = {
    isDirty: false,
    ...cloneDeep(
      omit(state.data, ['groupDisplays', 'groupIndices'])
    ),
  };
  return update(state, {
    stagingData: {$set: newStagingData},
  });
}

function updateBox(state, action) {
  const {groups} = action.data;
  const {options} = state;
  const groupIndices = (groups || []).map(group => new Fuse(
    group.items,
    searchOpts,
  ));
  const newData = update(action.data, {
    groupDisplays: {$set: filterSortGroups(groups, groupIndices, options)},
    groupIndices: {$set: groupIndices},
  });
  return copyToStaging(update(state, {
    data: {$set: newData},
  }));
}

function updateBoxInfo(state, action) {
  return update(state, {
    data: {
      name: {$set: action.data.name},
      fields: {$set: action.data.fields},
    },
    stagingData: {
      name: {$set: action.data.name},
      fields: {$set: action.data.fields},
    },
  });
}

function box(state = boxState, action) {
  switch (action.type) {
    case RESET_STAGING:
      return copyToStaging(state);
    case GET_BOX:
      return {
        ...state,
        data: {},
      };
    case GET_BOX_SUCCESS:
    case POST_BOX_SUCCESS:
    case PATCH_BOX_SUCCESS:
      return updateBox(state, action);
    case PATCH_BOX_INFO_SUCCESS:
      return updateBoxInfo(state, action);
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
        ...state.options,
        sort: newSort,
      };
      return updateOptions(state, optionsWithNewSort);
    case TOGGLE_FILTER:
      const {filter} = state.options;
      const newFilter = cloneDeep(filter);
      newFilter[action.key][action.choice] = !filter[action.key][action.choice];
      return updateOptions(state, {...state.options, filter: newFilter});
    case SELECT_ALL_FILTER:
      return updateOptions(state, {...state.options, filter: filterSelectAll});
    case UNSELECT_ALL_FILTER: 
      return updateOptions(state, {...state.options, filter: filterUnselectAll});

    case EDIT_ADD_ITEM: 
      const nextItemIdx = state.stagingData.groups
        ? state.stagingData.groups[action.groupIdx].nextItemIdx
        : 0;
      const emptyItem = makeEmptyItem(nextItemIdx);
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
        isDirty: {$set: true},
        groups: {[action.groupIdx]: {
          items: {$push:[emptyItem]},
          nextItemIdx: {$set: nextItemIdx + 1},
        }},
      }});
    case EDIT_DELETE_ITEM:
      return update(state, {stagingData: {
        isDirty: {$set: true},
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
        isDirty: {$set: true},
        groups: {[action.groupIdx]: {
          items: {$splice: [[action.srcIdx,1], [action.destIdx,0,itemMoveTarget]]},
        }},
      }});

    case EDIT_ADD_GROUP:
      const {nextGroupIdx} = state.stagingData;
      return update(state, {stagingData: {
        isDirty: {$set: true},
        groups: {$push: [makeEmptyGroup(nextGroupIdx)]},
        nextGroupIdx: {$set: nextGroupIdx + 1},
      }});
    case EDIT_DELETE_GROUP:
      return update(state, {stagingData: {
        isDirty: {$set: true},
        groups: {$splice: [[action.groupIdx,1]]},
      }});
    case EDIT_MOVE_GROUP:
      const groupMoveTarget = state.stagingData.groups[action.srcIdx];
      return update(state, {stagingData: {
        isDirty: {$set: true},
        groups: {$splice: [[action.srcIdx,1], [action.destIdx,0,groupMoveTarget]]},
      }});

    case EDIT_GROUP_TITLE:
      return update(state, {stagingData: {
        isDirty: {$set: true},
        groups: {[action.groupIdx]: {
          name: {$set: action.title},
        }},
      }});
    case EDIT_GROUP_TYPE:
      return update(state, {stagingData: {
        isDirty: {$set: true},
        groups: {[action.groupIdx]: {
          type: {$set: action.typeId},
        }},
      }});
    case EDIT_ITEM_FIELD:
    case EDIT_ITEM_FIELD_BATCHED:
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
            isDirty: {$set: true},
            groups: {[groupIdx]: {
              items: {$splice: [[dragSrcIdx,1], [dragDestIdx,0,itemMoveTarget]]},
            }},
          }});
        case 'GROUP':
          const groupMoveTarget = state
            .stagingData
            .groups[dragSrcIdx];
          const updateState = update(state, {stagingData: {
            isDirty: {$set: true},
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

export default undoable(box, {
  limit: 20,
  syncFilter: true,
  groupBy: groupByActionTypes([
    EDIT_GROUP_TITLE,
    EDIT_ITEM_FIELD_BATCHED,
  ]),
  filter: includeAction([  
    EDIT_ADD_ITEM,
    EDIT_DELETE_ITEM,
    EDIT_MOVE_ITEM,

    EDIT_ADD_GROUP,
    EDIT_DELETE_GROUP,
    EDIT_MOVE_GROUP,

    EDIT_GROUP_TITLE,
    EDIT_GROUP_TYPE,

    EDIT_ITEM_FIELD,
    EDIT_ITEM_FIELD_BATCHED,
    END_DRAG,
  ]),
});
