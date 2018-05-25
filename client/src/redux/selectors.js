export const color = (tears, id) => tears['colors'][id];
export const piece = (tears, id) => tears['pieces'][id];
export const rarity = (tears, id) => tears['rarities'][id];
export const type = (tears, id) => tears['types'][id];

export const effect = (tears, id) => {
  if (id >= 40000) {
    return tears['effects']['transformation'][id - 40000];
  } else if (id >= 30000) {
    return tears['effects']['proficiency'][id - 30000];
  } else if (id >= 20000) {
    return tears['effects']['destruction'][id - 20000];
  } else {
    return tears['effects']['balance'][id - 10000];
  }
}

