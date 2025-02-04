import { LeaderboardUser } from './user.interface';

export interface Squad {
  id: number;
  handle: string;
  title: string;
  joined: boolean;
  totalUsers: number;
}

export interface SquadData {
  id: number;
  handle: string;
  title: string;
  description: string;
  totalUsers: number;
  pointsUsers: LeaderboardUser[];
  maxScoreUsers: LeaderboardUser[];
  ranking: number;
  externalUrl: string;
}

export interface SquadUserRanking {
  pointsRanking: number;
  maxScoreRanking: number;
}
