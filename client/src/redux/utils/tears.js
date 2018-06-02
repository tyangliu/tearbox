export const effectsSearchOpts = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  tokenize: true,
  keys: [
    {name: 'name', weight: 0.33},
    {name: 'tags', weight: 0.33},
    {name: 'value', weight: 0.32},
    {name: 'alt_value', weight: 0.01},
    {name: 'char', weight: 0.01},
  ],
};

export function mergeEffects(effects) {
  return [
    ...effects.balance,
    ...effects.destruction,
    ...effects.proficiency,
    ...effects.transformation,
  ];
}
