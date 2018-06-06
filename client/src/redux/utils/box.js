import elasticlunr from 'elasticlunr';
import orderBy from 'lodash.orderby';
import omit from 'lodash.omit';
import forOwn from 'lodash.forown';
import emailValidator from 'email-validator';

import {color, effect, piece, rarity, type} from '../selectors';

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

export function buildItemsIndex(items) {
  const flatItems = items.map(item => ({
    idx: item.idx,
    color: item.color.name,
    effect: item.effect.name,
    effectTags: item.effect.tags.join(' '),
    piece: item.piece.name,
    pieceTags: item.piece.tags.join(' '),
    type: item.type.name,
    typeTags: item.type.tags.join(' '),
    rarity: item.rarity.name,
  }));

  const index = elasticlunr(function () {
    const self = this;
    [
      'color',
      'effect',
      'effectTags',
      'piece',
      'pieceTags',
      'type',
      'typeTags',
      'rarity',
    ].forEach(field => self.addField(field));
    this.setRef('idx');
    this.saveDocument(false);
  });

  for (let i = 0; i < flatItems.length; ++i) {
    index.addDoc(flatItems[i]);
  }
  return index;
}

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

export function sortGroups(groups, options) {
  if (!groups) {
    return groups;
  }
  return groups.map((group, i) => ({
    ...group,
    items: sortItems(group.items, options.sort),
  }));
};

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
        ? indices[i].search(options.searchTerm, {
            fields: {
              effect: {boost: 5},
              effectTags: {boost: 4},
              color: {boost: 1},
              piece: {boost: 1},
              pieceTags: {boost: 1},
              type: {boost: 1},
              typeTags: {boost: 1},
              rarity: {boost: 1},
            },
            bool: 'OR',
            expand: true,
          }).map(({ref, score}) => group.items[ref])
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
  const unpackedGroups = box.groups.map((group, i) => ({
    idx: i,
    nextItemIdx: group.items.length,
    ...group,
    items: group.items.map((item, j) => ({
      idx: j, ...unpackItem(tears, item)
    })),
  }));
  return {
    ...box,
    nextGroupIdx: unpackedGroups.length,
    groups: unpackedGroups,
  };
}

export function packItem(item) {
  return omit(item, [
    'color',
    'effect',
    'piece',
    'rarity',
    'type',
    'modified',
    'idx',
  ]);
}

export function isItemNonEmpty(item) {
  const {id, effect_id, piece_id} = item;
  return [id, effect_id, piece_id].some(v => v != null);
}

export function packBox(box) {
  const packedGroups = box.groups.map(group => omit({
    ...group,
    items: group.items.map(packItem).filter(isItemNonEmpty),
  }), ['idx', 'nextItemIdx']);
  return omit({
    ...box,
    groups: packedGroups,
  }, ['nextGroupIdx', 'isDirty']);
}

export function processNewBox(data, originId = null) {
  const {
    name, server, igns, discord, forum, other,
    passcode, email,
  } = data;
  const newBox = {
    name: name.trim(),
    passcode,
    fields: [
      {label: 'server', value: server.trim()},
      {label: 'igns', value: igns.trim()},
      {label: 'discord', value: discord.trim()},
      {label: 'forum', value: forum.trim()},
      {label: 'other', value: other.trim()},
    ],
  };
  const trimmedEmail = email.trim();
  if (trimmedEmail.length) {
    newBox.email = trimmedEmail;
  }
  if (originId) {
    newBox.origin_id = originId;
  }
  return newBox;
}

function validateForm(form, validator) {
  const result = {};
  forOwn(validator, ({req, message}, key) => {
    if (!req(form[key], form)) {
      result[key] = message;
    }
  });
  return result;
}

const newBoxValidator = {
  name: {
    req: v => v.length > 0 && v.length < 24,
    message: 'Name is required.',
  },
  passcode: {
    req: v => /^\S{6,}$/.test(v),
    message: 'Passcode must be 6 or more characters, no spaces.',
  },
  passcodeReenter: {
    req: (v, obj) => v === obj.passcode,
    message: 'Passcodes must match.',
  },
  email: {
    req: v => !v || emailValidator.validate(v),
    message: 'Email must be valid.',
  },
  igns: {
    req: v => v && v.length > 0,
    message: 'IGNs are required.',
  },
};

export const validateNewBox = form => validateForm(form, newBoxValidator);

export function processBoxInfo(data) {
  const {
    name, server, igns, discord, forum, other,
    oldPasscode, newPasscode, email,
  } = data;

  const newBoxInfo = {
    name: name.trim(),
    fields: [
      {label: 'server', value: server.trim()},
      {label: 'igns', value: igns.trim()},
      {label: 'discord', value: discord.trim()},
      {label: 'forum', value: forum.trim()},
      {label: 'other', value: other.trim()},
    ],
  };

  if (oldPasscode.length && newPasscode.length) {
    newBoxInfo.old_passcode = oldPasscode;
    newBoxInfo.passcode = newPasscode;
  }

  const trimmedEmail = email.trim();
  if (trimmedEmail.length) {
    newBoxInfo.email = trimmedEmail;
  }
  return newBoxInfo;
}

const boxInfoValidator = {
  name: {
    req: v => v.length > 0 && v.length < 24,
    message: 'Name is required.',
  },
  oldPasscode: {
    req: (v, obj) => (!v.length && !obj.newPasscode.length) || /^\S{6,}$/.test(v),
    message: 'Previous passcode is incorrect.',
  },
  newPasscode: {
    req: (v, obj) => (!v.length && !obj.oldPasscode.length) || /^\S{6,}$/.test(v),
    message: 'New passcode must be 6 or more characters, no spaces.',
  },
  newPasscodeReenter: {
    req: (v, obj) =>
      (!obj.oldPasscode.length && !obj.newPasscode.length) ||
      v === obj.newPasscode,
    message: 'New passcodes must match.',
  },
  email: {
    req: v => !v || emailValidator.validate(v),
    message: 'Email must be valid.',
  },
  igns: {
    req: v => v && v.length > 0,
    message: 'IGNs are required.',
  },
};

export const validateBoxInfo = form => validateForm(form, boxInfoValidator);
