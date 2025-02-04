import { Boost } from './boost.interface';

export interface Task {
  id: number;
  title: string;
  description: string;
  externalUrl: string;
  socialMedia: string;
  points: number;
  completed: boolean;
  boosts: Boost[];
}
