const elasticlunr = require('elasticlunr');
const fs = require('fs');

function flattenTags(effects) {
  return effects.map(eff => {
    return {
      ...eff,
      tags: eff.tags.join(' '),
    };
  });
}

function mergeEffects(effects) {
  return [
    ...effects.balance,
    ...effects.destruction,
    ...effects.proficiency,
    ...effects.transformation,
  ];
}

function buildEffectsIndex(effects) {
  const flatEffects = flattenTags(mergeEffects(effects));
}

fs.readFile('../data/tears.json', (err, data) =>  {
  if (err) throw err;
  const raw = JSON.parse(data);
  const flatEffects = flattenTags(mergeEffects(raw.effects));

  const index = elasticlunr(function () {
    this.addField('name');
    this.addField('tags');
    this.setRef('id');
    this.saveDocument(false);
  });

  for (let i = 0; i < flatEffects.length; ++i) {
    index.addDoc(flatEffects[i]);
  }

  fs.writeFile('../data/effects_index.json', JSON.stringify(index), err => {
    if (err) throw err;
    console.log('Saved index to data/tears_index.json');
  });
});
