import csv
import json
import os

import numpy as np

DATA_DIR = 'data/'
VT_PATH = os.path.join(DATA_DIR, 'value_tables.csv')
B_PATH = os.path.join(DATA_DIR, 'balance_effects.csv')
D_PATH = os.path.join(DATA_DIR, 'destruction_effects.csv')
P_PATH = os.path.join(DATA_DIR, 'proficiency_effects.csv')
T_PATH = os.path.join(DATA_DIR, 'transformation_effects.csv')
OUT_PATH = os.path.join(DATA_DIR, 'tears.json')

B_VT = 0
B_D = 1
B_TAG = 2

D_VT = 0
D_D = 1
D_CHR = 2
D_CLS = 3
D_TR = 4
D_ADV = 5
D_TAG = 6

P_VT = 0
P_D = 1
P_DO = 2
P_EX = 3
P_TAG = 4

T_VT = 0
T_D = 1
T_PCT = 2
T_IP = 3
T_TAG = 4

plus_e_desc = {
  '0e': '[0 +Enhancement Stats]',
  '1e': '[0.25 * (1 +Enhancement Stats)]',
  '2e': '[2 +Enhancement Stats]',
}

two_plus_e_tags = [
  '2+enhance', '2+e', '+enhance', '2e', 'enh+2', 'enhance+2'
]

COLOR_R = 0
COLOR_B = 1
COLOR_P = 2

PIECE_T = 0
PIECE_B = 1
PIECE_G = 2
PIECE_S = 3

TYPE_B = 0
TYPE_D = 1
TYPE_P = 2
TYPE_T = 3

RARITY_E = 0
RARITY_U = 1

piece_key_to_id = {
  't': 0,
  'b': 1,
  'g': 2,
  's': 3,
}

tear_data = {
  'colors': [
    {'id': COLOR_R, 'name': 'Red', 'key': 'r', 'tags': []},
    {'id': COLOR_B, 'name': 'Blue', 'key': 'b', 'tags': []},
    {'id': COLOR_P, 'name': 'Purple', 'key': 'p', 'tags': []},
  ],
  'pieces': [
    {'id': PIECE_T, 'name': 'Top', 'key': 't', 'tags': []}, 
    {'id': PIECE_B, 'name': 'Bottom', 'key': 'b', 'tags': ['btm', 'bot']},
    {'id': PIECE_G, 'name': 'Gloves', 'key': 'g', 'tags': []},
    {'id': PIECE_S, 'name': 'Shoes', 'key': 's', 'tags': []},
  ],
  'types': [
    {'id': TYPE_B, 'name': 'Balance', 'key': 'b', 'tags': ['triangle']},
    {'id': TYPE_D, 'name': 'Destruction', 'key': 'd', 'tags': ['square', 'skill damage']},
    {'id': TYPE_P, 'name': 'Proficiency', 'key': 'p', 'tags': ['hexagon', 'buff']},
    {'id': TYPE_T, 'name': 'Transformation', 'key': 't', 'tags': ['circle', 'stat']},
  ],
  'rarities': [
    {'id': RARITY_E, 'name': 'Elite', 'key': 'e', 'tags': ['purple']},
    {'id': RARITY_U, 'name': 'Unique', 'key': 'u', 'tags': ['gold']},
  ],
  # To be generated
  'effects': {
    # {id, v_id (variant), name, value, rarity_id, type_id, tags}
    'balance': None,
    # {id, v_id (variant), name, value, rarity_id, type_id, char, class, tier, advancement, tags}
    'destruction': None,
    # {id, v_id (variant), name, value, rarity_id, type_id, x_piece_id, tags}
    'proficiency': None,
    # {id, v_id (variant), name, value, rarity_id, type_id, alt_value, value_is_pct, tags}
    'transformation': None,
  },
}


def normalize(text):
  return text.lower().strip()


def load_csv(path, skip_rows=0, skip_cols=0, dtype=None):
  data = np.genfromtxt(path, dtype=dtype, delimiter=',', autostrip=True, skip_header=skip_rows).tolist()
  return data[:][skip_cols:]
  

def load_vt(path=VT_PATH):
  result = []
  with open(path) as f:
    data = [list(filter(lambda x: x.strip() and ' ' not in x, s.strip().split(','))) for s in f.readlines()]
    data = [[plus_e_desc[i] if 'e' in i else float(i) for i in s] for s in data]
    
  assert len(data) % 2 == 0
  for i in range(0, len(data)//2):
    result.append({
      'elite': data[i*2],
      'unique': data[i*2+1],
    })
  return result


def enumerate_values(desc, values, format_fn=lambda s, v: s.format(v)):
  result = []
  for v in values['elite']:
    result.append((format_fn(desc, v), v, 0))
  for v in values['unique']:
    result.append((format_fn(desc, v), v, 1))
  return result


def parse_tags(tags):
  return [normalize(s) for s in tags.split('!')]


def make_value_tags(desc, tags, v, is_pct):
  v_strs = [
    ('{}' if isinstance(v, str) else '{0:g}').format(v)
  ]

  if is_pct:
    v_strs.append(
      ('{}%' if isinstance(v, str) else '{0:g}%').format(v)
    )

  result = []
  for v_str in v_strs:
    result += (
      [' '.join([desc, v_str])] +
      [' '.join([tag, v_str]) for tag in tags]
    )

  return result


def generate_effects(
  vt_path=VT_PATH,
  b_path=B_PATH,
  d_path=D_PATH,
  p_path=P_PATH,
  t_path=T_PATH,
):
  vt = load_vt(vt_path)
  b_data = (load_csv(b_path, skip_rows=1, dtype=(int,'U100','U100')),)
  d_data = load_csv(d_path, skip_rows=1, dtype=(int,'U100','U100','U100','U100',int,'U100'))
  p_data = load_csv(p_path, skip_rows=1, dtype=(int,'U100','U100','U100','U100'))
  t_data = load_csv(t_path, skip_rows=1, dtype=(int,'U100',int,int,'U100'))
  
  global next_id
  next_id = -1
  def get_next_id():
    global next_id
    next_id += 1
    return next_id

  # Balance        {id, v_id (variant), name, value, rarity_id, type_id, tags}
  next_id = 9999
  b = []
  for i in range(0, len(b_data)):
    desc = b_data[i][B_D].replace('{}', '{0:g}')
    values = vt[b_data[i][B_VT]]
    descs_with_values = enumerate_values(desc, values)

    tags = parse_tags(b_data[i][B_TAG])

    for desc, value, rarity in descs_with_values:
      extra_tags = make_value_tags(desc, tags, value, False)
      b.append({
        'id': get_next_id(),
        'v_id': i,
        'name': desc,
        'value': value,
        'rarity_id': rarity,
        'type_id': TYPE_B,
        'tags': tags + extra_tags,
      })

  # Destruction    {id, v_id (variant), name, value, rarity_id, type_id, char, class, tier, advancement, tags}
  next_id = 19999
  d = []
  for i in range(0, len(d_data)):
    desc = d_data[i][D_D].replace('{}', '{0:g}')
    values = vt[d_data[i][D_VT]]
    descs_with_values = enumerate_values(
      desc,
      values,
      format_fn=lambda s, v: (s + (' +{}%' if isinstance(v, str) else ' +{0:g}%')).format(v),
    )

    char = d_data[i][D_CHR]
    cls = d_data[i][D_CLS]
    tier = d_data[i][D_TR]
    adv = d_data[i][D_ADV]
    tags = parse_tags(d_data[i][D_TAG])

    for desc, value, rarity in descs_with_values:
      d.append({
        'id': get_next_id(),
        'v_id': i,
        'name': desc,
        'value': value,
        'rarity_id': rarity,
        'type_id': TYPE_D,
        'char': char if char else None,
        'class': cls if cls else None,
        'tier': tier if tier else None,
        'advancement': adv if adv >= 0 else None,
        'tags': tags,
      })
        
  # Proficiency    {id, v_id (variant), name, value, rarity_id, type_id, x_piece_id, tags}
  next_id = 29999
  p = []
  for i in range(0, len(p_data)):
    desc = p_data[i][P_D]
    values = vt[p_data[i][P_VT]]
    descs_with_values = enumerate_values(
      desc,
      values,
      format_fn=lambda s, v: s.format(v) if isinstance(v, str) else s.replace('{}', '{0:g}').format(v),
    )

    x_piece = None if not p_data[i][P_EX] else piece_key_to_id[p_data[i][P_EX]]
    tags = parse_tags(p_data[i][P_TAG])


    for desc, value, rarity in descs_with_values:
      extra_tags = make_value_tags(desc, tags, value, True)

      if value == plus_e_desc['2e']:
        extra_tags += two_plus_e_tags

        for two_plus_e_tag in two_plus_e_tags:
          extra_tags += make_value_tags(desc, tags, two_plus_e_tag, True)
        
      p.append({
        'id': get_next_id(),
        'v_id': i,
        'name': desc,
        'value': value,
        'rarity_id': rarity,
        'type_id': TYPE_P,
        'x_piece_id': x_piece,
        'tags': tags + extra_tags,
      })

  # Transformation {id, v_id (variant), name, value, rarity_id, type_id, alt_value, value_is_pct, tags}
  def format_trans(s, v, is_pct, one_pct):
    if is_pct:
      return (s + ' +{0:g}%').format(v)
    elif one_pct >= 0:
      return (s + ' +{0:g}').format(np.ceil(v * one_pct))
    else:
      return (s + ' +{0:g}').format(v)

  next_id = 39999
  t = []
  for i in range(0, len(t_data)):
    desc = t_data[i][T_D]
    values = vt[t_data[i][T_VT]]
    one_pct = t_data[i][T_PCT]
    is_pct = t_data[i][T_IP]

    descs_with_values = enumerate_values(
      desc,
      values,
      format_fn=lambda s, v: format_trans(s, v, is_pct, one_pct),
    )

    tags = parse_tags(t_data[i][T_TAG])
    
    for desc, value, rarity in descs_with_values:
      alt_value = None

      if one_pct >= 0:
        alt_value = np.ceil(value * one_pct)

        if not is_pct:
          tmp = value
          value = alt_value
          alt_value = tmp

      t.append({
        'id': get_next_id(),
        'v_id': i,
        'name': desc,
        'value': value,
        'rarity_id': rarity,
        'type_id': TYPE_T,
        'alt_value': alt_value,
        'value_is_pct': bool(is_pct),
        'tags': tags + make_value_tags(desc, [], value, is_pct),
      })

  return b, d, p, t


def main():
  b, d, p, t = generate_effects()

  tear_data['effects']['balance'] = b
  tear_data['effects']['destruction'] = d
  tear_data['effects']['proficiency'] = p
  tear_data['effects']['transformation'] = t

  with open(OUT_PATH, 'w') as f:
    json.dump(tear_data, f)


if __name__ == '__main__':
  main()
