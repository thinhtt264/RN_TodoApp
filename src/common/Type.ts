export type PriorityType = 'high' | 'medium' | 'low';
export interface TodoItemType {
  id: string;
  title: string;
  priority: PriorityType;
  isDone?: boolean;
  time?: number;
}
