import Fuse from 'fuse.js';

import {REQUEST_TEARS, RECEIVE_TEARS, SEARCH_ITEM_EFFECTS} from '../actions'; 
import {mergeEffects, effectsSearchOpts} from '../utils/tears';

const tearsState = {
  colors: [],
  pieces: [],
  types: [],
  effects: [],
  filteredEffects: [],
  effectsIndex: null,
  effectsSearchTerm: '',
};

export default function tears(state = tearsState, action) {
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
