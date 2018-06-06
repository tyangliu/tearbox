import elasticlunr from 'elasticlunr';
import {REQUEST_TEARS, RECEIVE_TEARS, SEARCH_ITEM_EFFECTS} from '../actions'; 
import {effect} from '../selectors/tears';

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
        effectsIndex: elasticlunr.Index.load(action.index),
        effectsSearchTerm: '',
      };
    case SEARCH_ITEM_EFFECTS:
      const {effectsIndex} = state;
      const filteredEffects = effectsIndex && action.searchTerm.length
        ? effectsIndex
            .search(action.searchTerm, {
              fields: {
                name: {boost: 5},
                tags: {boost: 4},
                value: {boost: 1},
                char: {boost: 1},
              },
              bool: "OR",
              expand: true,
            })
            .slice(0, 30)
            .map(({ref, score}) => effect(state, ref))
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
