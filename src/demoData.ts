import { Player, Trainer } from './types';

export const DEMO_PLAYERS: Player[] = [
  {
    id: 'p1',
    firstName: 'Luca',
    lastName: 'Müller',
    number: 1,
    notes: 'Torhüter, gute Reflexe',
  },
  {
    id: 'p2',
    firstName: 'Noah',
    lastName: 'Schneider',
    number: 2,
  },
  {
    id: 'p3',
    firstName: 'Finn',
    lastName: 'Fischer',
    number: 3,
  },
  {
    id: 'p4',
    firstName: 'Jonas',
    lastName: 'Weber',
    number: 4,
  },
  {
    id: 'p5',
    firstName: 'Leon',
    lastName: 'Meyer',
    number: 5,
  },
  {
    id: 'p6',
    firstName: 'Elias',
    lastName: 'Wagner',
    number: 6,
  },
  {
    id: 'p7',
    firstName: 'Tim',
    lastName: 'Becker',
    number: 7,
  },
  {
    id: 'p8',
    firstName: 'Max',
    lastName: 'Schulz',
    number: 8,
  },
  {
    id: 'p9',
    firstName: 'Felix',
    lastName: 'Hoffmann',
    number: 9,
  },
  {
    id: 'p10',
    firstName: 'Nico',
    lastName: 'Koch',
    number: 10,
  },
];

export const DEMO_COACHES: string[] = ['Coach Markus', 'Trainer Daniela'];

export const DEMO_TRAINERS: Trainer[] = [
  { id: 'tr1', firstName: 'Markus', lastName: 'Müller', role: 'Haupttrainer' },
  { id: 'tr2', firstName: 'Daniela', lastName: 'Schneider', role: 'Assistenztrainerin' },
];
