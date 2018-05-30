export const EDIT_ADD_ITEM = 'EDIT_ADD_ITEM';
export const EDIT_DELETE_ITEM = 'EDIT_DELETE_ITEM';
export const EDIT_MOVE_ITEM = 'EDIT_MOVE_ITEM';

export const EDIT_ADD_GROUP = 'EDIT_ADD_GROUP';
export const EDIT_DELETE_GROUP = 'EDIT_DELETE_GROUP';
export const EDIT_MOVE_GROUP = 'EDIT_MOVE_GROUP';

export const EDIT_GROUP_TITLE = 'EDIT_GROUP_TITLE';
export const EDIT_GROUP_TYPE = 'EDIT_GROUP_TYPE';

export const EDIT_ITEM_FIELD = 'EDIT_ITEM_FIELD';
export const SEARCH_ITEM_EFFECTS = 'SEARCH_ITEM_EFFECTS';

export const END_DRAG = 'END_DRAG';

export const editAddItem = groupIdx => ({
  type: EDIT_ADD_ITEM,
  groupIdx,
});

export const editDeleteItem = (groupIdx, itemIdx) => ({
  type: EDIT_DELETE_ITEM,
  groupIdx,
  itemIdx,
});

export const editMoveItem = (groupIdx, srcIdx, destIdx) => ({
  type: EDIT_MOVE_ITEM,
  groupIdx,
  srcIdx,
  destIdx,
});

export const editAddGroup = () => ({
  type: EDIT_ADD_GROUP,
});

export const editDeleteGroup = groupIdx => ({
  type: EDIT_DELETE_GROUP,
  groupIdx,
});

export const editMoveGroup = (srcIdx, destIdx) => ({
  type: EDIT_MOVE_GROUP,
  srcIdx,
  destIdx,
});

export const editGroupTitle = (groupIdx, title) => ({
  type: EDIT_GROUP_TITLE,
  groupIdx,
  title,
});

export const editGroupType = (groupIdx, typeId) => ({
  type: EDIT_GROUP_TYPE,
  groupIdx,
  typeId,
});

export const editItemField = (tears, groupIdx, itemIdx, key, value) => ({
  type: EDIT_ITEM_FIELD,
  tears,
  groupIdx,
  itemIdx,
  key,
  value,
});

export const searchItemEffects = searchTerm => ({
  type: SEARCH_ITEM_EFFECTS,
  searchTerm,
});

export const endDrag = result => ({
  type: END_DRAG,
  result,
});
