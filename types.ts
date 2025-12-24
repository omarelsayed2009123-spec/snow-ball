
export interface SubStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  subSteps: SubStep[];
  category: 'personal' | 'work' | 'urgent' | 'growth';
  createdAt: number;
}

export type TaskCategory = Task['category'];
