import ls from 'local-storage';

const tempMap = new Map();

const storage = {
  set(k, v, persist=true) {
    (persist ? ls : tempMap).set(k, v);
  },
  get(k) {
    return tempMap.get(k) || ls.get(k);
  }
};

export default storage;
