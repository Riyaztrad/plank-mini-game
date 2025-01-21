import { Boost } from './boost.interface';

export interface LeaderboardUser {
  id: string;
  username: string;
  points: number;
}

export interface TelegramUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  walletAddress: string;
  code: string;
  points: number;
  gems: number;
  maxScore: number;
  pointsRanking: number;
  maxScoreRanking: number;
  league: UserLeague;
  boosts: Boost[];
}

export interface Friend {
  id: string;
  username: string;
  totalReferrals: number;
  friendPoints: number;
  yourPoints: number;
}

export interface UserLeague {
  id: number;
  title: string;
  image: string;
}
