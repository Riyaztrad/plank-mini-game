export interface League {
  id: number;
  title: string;
  description: string;
  image: string;
  points: number;
  requiredScore: number;
  rewardsPool: number;
  completed: boolean;
}
