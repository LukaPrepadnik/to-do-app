import {Task} from './types';

export const initialTasks: Task[] = [
  {
    id: '1',
    name: 'Nakupovanje',
    description: 'Kupiti je treba živila za vikend',
    category: 'Nakupi',
    deadline: '2025-03-15',
    reminder: '2025-03-14',
  },
  {
    id: '2',
    name: 'Telovadba',
    description: 'Iti na tek in vadbo za moč',
    category: 'Zdravje',
    deadline: '2025-03-16',
    reminder: '2025-03-16',
  },
  {
    id: '3',
    name: 'Zdravniški pregled',
    description: 'Redni pregled pri zdravniku',
    category: 'Zdravje',
    deadline: '2025-03-22',
    reminder: '2025-03-21',
  },
  {
    id: '4',
    name: 'Popravilo avtomobila',
    description: 'Popraviti zadnje luči na avtomobilu',
    category: 'Osebno',
    deadline: '2025-03-25',
    reminder: '2025-03-24',
  },
  {
    id: '5',
    name: 'Obisk knjižnice',
    description: 'Vrniti knjige v knjižnico in izposoditi nove',
    category: 'Osebno',
    deadline: '2025-03-26',
    reminder: '2025-03-25',
  },
];
