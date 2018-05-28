export const effectsSearchOpts = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [
    {name: 'name', weight: 0.3},
    {name: 'tags', weight: 0.3},
    {name: 'value', weight: 0.3},
    {name: 'alt_value', weight: 0.035},
    {name: 'char', weight: 0.035},
    {name: 'class', weight: 0.03},
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
