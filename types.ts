export type TaskCategory =
  | 'Šola'
  | 'Delo'
  | 'Osebno'
  | 'Nakupi'
  | 'Zdravje'
  | 'Drugo';

export type Task = {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  deadline: string;
  reminder: string;
  userId?: string;
};
