import Fuse from 'fuse.js';
import cloneDeep from 'lodash.clonedeep';
import update from 'immutability-helper';

import {
  ASCENDING,
  DESCENDING,

  GET_BOX,
  GET_BOX_SUCCESS,
  GET_BOX_FAILURE,

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


const groupTypes = [
  {id: 0, label: 'Selling'},
  {id: 1, label: 'Buying'},
];

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
  type: groupTypes[0],
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
    groups: {[groupIdx]: {
      items: {[itemIdx]: {$set: newItem}},
    }},
  }});
}

export default function box(state = boxState, action) {
  const {options} = state;
  switch (action.type) {
    case GET_BOX:
      return {
        ...state,
        data: {},
      };
    case GET_BOX_SUCCESS:
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
    case EDIT_GROUP_TYPE:
      return update(state, {stagingData: {
        groups: {[action.groupIdx]: {
          type: {$set: groupTypes[action.typeId]},
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
