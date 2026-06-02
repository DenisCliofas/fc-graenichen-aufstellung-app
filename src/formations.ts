export interface PositionDef {
  key: string;
  labelKey: string;
  short: string;
  fieldPos: [number, number];
}

export interface FormationConfig {
  id: string;
  labelKey: string;
  playerCount: 7 | 9 | 11;
  rows: PositionDef[][];
}

export const ALL_FORMATIONS: FormationConfig[] = [
  {
    id: '7v7-1-3-3',
    labelKey: 'formation_7v7_1_3_3',
    playerCount: 7,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftDefense', labelKey: 'pos_left_defense', short: 'VL', fieldPos: [65, 18] },
        { key: 'centerDefense', labelKey: 'pos_center_defense', short: 'LIB', fieldPos: [59, 50] },
        { key: 'rightDefense', labelKey: 'pos_right_defense', short: 'VR', fieldPos: [65, 82] },
      ],
      [
        { key: 'leftWing', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [34, 18] },
        { key: 'striker', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [26, 50] },
        { key: 'rightWing', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [34, 82] },
      ],
    ],
  },
  {
    id: '7v7-2-3-1',
    labelKey: 'formation_7v7_2_3_1',
    playerCount: 7,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [67, 28] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [67, 72] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [47, 18] },
        { key: 'centerMid', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [47, 50] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [47, 82] },
      ],
      [{ key: 'striker', labelKey: 'pos_striker', short: 'ST', fieldPos: [22, 50] }],
    ],
  },
  {
    id: '9v9-3-3-2',
    labelKey: 'formation_9v9_3_3_2',
    playerCount: 9,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [67, 15] },
        { key: 'centerBack', labelKey: 'pos_center_back', short: 'IV', fieldPos: [67, 50] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [67, 85] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [47, 18] },
        { key: 'centerMid', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [47, 50] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [47, 82] },
      ],
      [
        { key: 'leftForward', labelKey: 'pos_left_forward', short: 'LS', fieldPos: [24, 33] },
        { key: 'rightForward', labelKey: 'pos_right_forward', short: 'RS', fieldPos: [24, 67] },
      ],
    ],
  },
  {
    id: '9v9-3-2-3',
    labelKey: 'formation_9v9_3_2_3',
    playerCount: 9,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [67, 15] },
        { key: 'centerBack', labelKey: 'pos_center_back', short: 'IV', fieldPos: [67, 50] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [67, 85] },
      ],
      [
        { key: 'defensiveMid', labelKey: 'pos_defensive_mid', short: 'DM', fieldPos: [50, 33] },
        { key: 'attackMid', labelKey: 'pos_attack_mid', short: 'AM', fieldPos: [50, 67] },
      ],
      [
        { key: 'leftWing', labelKey: 'pos_left_wing', short: 'LW', fieldPos: [24, 15] },
        { key: 'centerForward', labelKey: 'pos_striker', short: 'ST', fieldPos: [24, 50] },
        { key: 'rightWing', labelKey: 'pos_right_wing', short: 'RW', fieldPos: [24, 85] },
      ],
    ],
  },
  {
    id: '9v9-2-3-2-1',
    labelKey: 'formation_9v9_2_3_2_1',
    playerCount: 9,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [68, 28] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [68, 72] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [52, 18] },
        { key: 'centerMid', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [52, 50] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [52, 82] },
      ],
      [
        { key: 'leftAtt', labelKey: 'pos_left_att', short: 'LA', fieldPos: [35, 33] },
        { key: 'rightAtt', labelKey: 'pos_right_att', short: 'RA', fieldPos: [35, 67] },
      ],
      [{ key: 'striker', labelKey: 'pos_striker', short: 'ST', fieldPos: [18, 50] }],
    ],
  },
  {
    id: '11v11-4-4-2',
    labelKey: 'formation_11v11_4_4_2',
    playerCount: 11,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [68, 10] },
        { key: 'centerBackL', labelKey: 'pos_center_back_l', short: 'IVL', fieldPos: [68, 35] },
        { key: 'centerBackR', labelKey: 'pos_center_back_r', short: 'IVR', fieldPos: [68, 65] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [68, 90] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [48, 10] },
        { key: 'centerMidL', labelKey: 'pos_center_mid_l', short: 'LM', fieldPos: [48, 35] },
        { key: 'centerMidR', labelKey: 'pos_center_mid_r', short: 'RM', fieldPos: [48, 65] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [48, 90] },
      ],
      [
        { key: 'leftForward', labelKey: 'pos_left_forward', short: 'LS', fieldPos: [25, 33] },
        { key: 'rightForward', labelKey: 'pos_right_forward', short: 'RS', fieldPos: [25, 67] },
      ],
    ],
  },
  {
    id: '11v11-4-3-3',
    labelKey: 'formation_11v11_4_3_3',
    playerCount: 11,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [68, 10] },
        { key: 'centerBackL', labelKey: 'pos_center_back_l', short: 'IVL', fieldPos: [68, 35] },
        { key: 'centerBackR', labelKey: 'pos_center_back_r', short: 'IVR', fieldPos: [68, 65] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [68, 90] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [48, 18] },
        { key: 'centerMid', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [48, 50] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [48, 82] },
      ],
      [
        { key: 'leftWing', labelKey: 'pos_left_wing', short: 'LW', fieldPos: [25, 15] },
        { key: 'striker', labelKey: 'pos_striker', short: 'ST', fieldPos: [25, 50] },
        { key: 'rightWing', labelKey: 'pos_right_wing', short: 'RW', fieldPos: [25, 85] },
      ],
    ],
  },
  {
    id: '11v11-3-5-2',
    labelKey: 'formation_11v11_3_5_2',
    playerCount: 11,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [68, 15] },
        { key: 'centerBack', labelKey: 'pos_center_back', short: 'IV', fieldPos: [68, 50] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [68, 85] },
      ],
      [
        { key: 'leftMid', labelKey: 'pos_left_mid', short: 'ML', fieldPos: [50, 10] },
        { key: 'centerMidL', labelKey: 'pos_center_mid_l', short: 'LM', fieldPos: [50, 30] },
        { key: 'centerMid', labelKey: 'pos_center_mid', short: 'MF', fieldPos: [50, 50] },
        { key: 'centerMidR', labelKey: 'pos_center_mid_r', short: 'RM', fieldPos: [50, 70] },
        { key: 'rightMid', labelKey: 'pos_right_mid', short: 'MR', fieldPos: [50, 90] },
      ],
      [
        { key: 'leftForward', labelKey: 'pos_left_forward', short: 'LS', fieldPos: [25, 33] },
        { key: 'rightForward', labelKey: 'pos_right_forward', short: 'RS', fieldPos: [25, 67] },
      ],
    ],
  },
  {
    id: '11v11-4-2-3-1',
    labelKey: 'formation_11v11_4_2_3_1',
    playerCount: 11,
    rows: [
      [{ key: 'goalkeeper', labelKey: 'pos_goalkeeper', short: 'TOR', fieldPos: [84, 50] }],
      [
        { key: 'leftBack', labelKey: 'pos_left_back', short: 'LB', fieldPos: [68, 10] },
        { key: 'centerBackL', labelKey: 'pos_center_back_l', short: 'IVL', fieldPos: [68, 35] },
        { key: 'centerBackR', labelKey: 'pos_center_back_r', short: 'IVR', fieldPos: [68, 65] },
        { key: 'rightBack', labelKey: 'pos_right_back', short: 'RB', fieldPos: [68, 90] },
      ],
      [
        { key: 'defensiveMidL', labelKey: 'pos_defensive_mid_l', short: 'DML', fieldPos: [55, 35] },
        { key: 'defensiveMidR', labelKey: 'pos_defensive_mid_r', short: 'DMR', fieldPos: [55, 65] },
      ],
      [
        { key: 'leftAtt', labelKey: 'pos_left_att', short: 'LA', fieldPos: [38, 15] },
        { key: 'attackMid', labelKey: 'pos_attack_mid', short: 'AM', fieldPos: [38, 50] },
        { key: 'rightAtt', labelKey: 'pos_right_att', short: 'RA', fieldPos: [38, 85] },
      ],
      [{ key: 'striker', labelKey: 'pos_striker', short: 'ST', fieldPos: [20, 50] }],
    ],
  },
];

export const DEFAULT_FORMATION_ID = '11v11-4-4-2';

export function getFormation(id: string): FormationConfig {
  return ALL_FORMATIONS.find(f => f.id === id) ?? ALL_FORMATIONS[0];
}

export function getDefaultFormationForCount(count: 7 | 9 | 11): FormationConfig {
  return ALL_FORMATIONS.find(f => f.playerCount === count) ?? ALL_FORMATIONS[0];
}

export function getAllPositionKeys(formation: FormationConfig): string[] {
  return formation.rows.flat().map(p => p.key);
}

export function getStarterOrder(formation: FormationConfig): string[] {
  return formation.rows.flat().map(p => p.key);
}
