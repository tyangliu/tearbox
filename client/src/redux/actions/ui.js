export const ASCENDING = 0;
export const DESCENDING = 1;

export const TOGGLE_GROUP = 'TOGGLE_GROUP';
export const SEARCH = 'SEARCH';
export const TOGGLE_SORT = 'TOGGLE_SORT';

export const SET_COPIED = 'SET_COPIED';
export const UNSET_COPIED = 'UNSET_COPIED';

export const TOGGLE_FILTER_MENU = 'TOGGLE_FILTER_MENU';
export const CLOSE_FILTER_MENU = 'CLOSE_FILTER_MENU';
export const TOGGLE_FILTER = 'TOGGLE_FILTER';
export const SELECT_ALL_FILTER = 'SELECT_ALL_FILTER';
export const UNSELECT_ALL_FILTER = 'UNSELECT_ALL_FILTER';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';

export const toggleGroup = idx => ({
  type: TOGGLE_GROUP,
  idx,
});

export const search = searchTerm => ({
  type: SEARCH,
  searchTerm,
});

export const toggleSort = key => ({
  type: TOGGLE_SORT,
  key,
});

export const setCopied = () => ({
  type: SET_COPIED,
});

export const unsetCopied = () => ({
  type: UNSET_COPIED,
});

export const toggleFilterMenu = () => ({
  type: TOGGLE_FILTER_MENU,
});

export const closeFilterMenu = () => ({
  type: CLOSE_FILTER_MENU,
});

export const toggleFilter = (key, choice) => ({
  type: TOGGLE_FILTER,
  key,
  choice,
});

export const selectAllFilter = () => ({
  type: SELECT_ALL_FILTER,
});

export const unselectAllFilter = () => ({
  type: UNSELECT_ALL_FILTER,
});

export const openModal = key => ({
  type: OPEN_MODAL,
  key,
});

export const closeModal = key => ({
  type: CLOSE_MODAL,
  key,
});

