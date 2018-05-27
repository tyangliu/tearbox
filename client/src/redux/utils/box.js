import {color, effect, piece, rarity, type} from '../selectors';

import orderBy from 'lodash.orderby';

export const searchOpts = {
  shouldSort: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name: 'effect.name',      weight: 0.3},
    {name: 'effect.tags',      weight: 0.1},
    {name: 'effect.char',      weight: 0.05},
    {name: 'effect.class' ,    weight: 0.05},
    {name: 'effect.tier',      weight: 0.05},
    {name: 'piece.name',       weight: 0.1},
    {name: 'type.name',        weight: 0.05},
    {name: 'rarity.name',      weight: 0.05},
    {name: 'color.name',       weight: 0.05},
    {name: 'effect.value',     weight: 0.05},
    {name: 'effect.alt_value', weight: 0.05},
    {name: 'piece.tags',       weight: 0.05},
    {name: 'type.tags',        weight: 0.05},
  ],
};

const orderTemplates = [
  ['asc', 'asc', 'asc', 'asc', 'asc', 'desc'],
  ['desc', 'asc', 'asc', 'asc', 'asc', 'desc'],
  ['asc', 'asc', 'asc', 'asc', 'asc', 'asc'],
  ['desc', 'asc', 'asc', 'asc', 'asc', 'asc'],
];

const keyToIdx = {
  'color': 0,
  'effect': 1,
  'piece': 2,
  'type': 3,
  'rarity': 4,
  'created': 5,
};

const keys = ['color.id', 'effect.id', 'piece.id', 'type.id', 'rarity.id', 'created'];

const filterKeys = [
  'color',
  'piece',
  'type',
  'rarity',
];

const withFirst = (keys, i) => [keys[i], ...keys.slice(0).splice(i,1)];
const getSortKeys = key => key ? withFirst(keys, keyToIdx[key]) : [[],[]];

export function sortItems(items, sortOpts) {
  const keys = getSortKeys(sortOpts.key);
  const orderIdx = sortOpts.order + (sortOpts.key == 'created' ? 2 : 0);
  const orders = orderTemplates[orderIdx];

  return orderBy(items, keys, orders);
}

export function filterItems(items, filterOpts) {
  return items.filter(item =>
    filterKeys
      .filter(key => filterOpts[key].some(v => v))
      .every(key => filterOpts[key][item[key].id])
  );
}

export function filterSortGroups(groups, indices, options) {
  if (!groups) {
    return groups;
  }
  const shouldSearch = options.searchTerm.length > 0;
  return groups.map((group, i) => ({
    ...group,
    // Since search overrides sorting, they are mutually exclusive operations.
    items: filterItems(
      shouldSearch
        ? indices[i].search(options.searchTerm)
        : sortItems(group.items, options.sort),
      options.filter,
    ),
  }));
}

export function unpackItem(tears, item) {
  const effectData = (item.effect_id && effect(tears, item.effect_id)) || {};
  return {
    ...item,
    color: ((item.color_id != null) && color(tears, item.color_id)) || {},
    effect: effectData,
    piece: ((effectData.x_piece_id != null || item.piece_id != null) && piece(
      tears,
      (effectData.x_piece_id != null)
        ? effectData.x_piece_id
        : item.piece_id,
    )) || {},
    piece_id: effectData.x_piece_id != null ? effectData.x_piece_id : item.piece_id,
    rarity: ((effectData.rarity_id != null) && rarity(tears, effectData.rarity_id)) || {},
    type: ((effectData.type_id != null) && type(tears, effectData.type_id)) || {},
  }
}

export function unpackBox(tears, box) {
  const unpackedGroups = box.groups.map(group => ({
    ...group,
    items: group.items.map((item, i) => ({idx: i, ...unpackItem(tears, item)})),
  }));
  return {
    ...box,
    groups: unpackedGroups,
  };
}
