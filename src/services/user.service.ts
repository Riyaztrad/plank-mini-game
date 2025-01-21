import axios from 'axios';
import { Friend, LeaderboardUser, TelegramUser, User } from '../types/user.interface';
import { axiosDefault } from '../lib/axios';
import { DailyRewards } from '../types/reward.interface';

export async function getScoreLeaderboard(userId: string): Promise<LeaderboardUser[]> {
  try {
    const response = await axios.get(`/api/leaderboard/score?userId=${userId}`);
    return response.data.leaderboard;
  } catch (err) {
    console.log(err);
    return [];
  }
}
export async function getPointsLeaderboard(userId: string): Promise<LeaderboardUser[]> {
  try {
    const response = await axios.get(`/api/leaderboard/points?userId=${userId}`);
    return response.data.leaderboard;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getUserData(userId: string): Promise<User> {
  try {
    const response = await axiosDefault.get(`/api/users/${userId}`);
    return response.data.user;
  } catch (err) {
    console.log(err);
    return {} as User;
  }
}

export async function getOrCreateUser(
  user: TelegramUser,
  referralCode?: string
): Promise<User | null> {
  try {
    const response = await axiosDefault.post(`/api/users`, { user, referralCode });
    return response.data.user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function validateHash(hash: string): Promise<boolean> {
  try {
    await axios.post(`/api/validate-hash`, { hash });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getFriends(userId: string): Promise<Friend[]> {
  try {
    const response = await axiosDefault.get(`/api/users/${userId}/friends`);
    return response.data.friends;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function createUserGame(userId: string, key: string): Promise<string> {
  try {
    const res = await axiosDefault.post(`/api/users/${userId}/game`, { key });
    return res.data.gameId;
  } catch (err) {
    console.log(err);
    return '';
  }
}

export async function updateUserPoints(
  userId: string,
  points: number,
  gameId: string,
  key: string
): Promise<boolean> {
  try {
    await axiosDefault.post(`/api/users/${userId}/points`, {
      points,
      gameId,
      key,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function updateBoostCount(
  userId: string,
  playCoins: number,
  timeCoins: number,
  boostCoins: number,
  shieldCoins: number,
  magnetCoins: number
): Promise<boolean> {
  const boosts = [
    { id: 0, amount: playCoins },
    { id: 1, amount: timeCoins },
    { id: 2, amount: boostCoins },
    { id: 3, amount: shieldCoins },
    { id: 4, amount: magnetCoins },
  ];
  try {
    await axiosDefault.post(`/api/users/${userId}/boosts`, {
      boosts,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function setUserWalletAddress(
  userId: string,
  walletAddress: string
): Promise<boolean> {
  try {
    await axiosDefault.post(`/api/users/${userId}/wallet`, { walletAddress });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function claimDailyRewards(userId: string): Promise<DailyRewards | null> {
  try {
    const res = await axiosDefault.post(`/api/users/${userId}/daily`);
    return res.data.rewards;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function updateWriteAccess(userId: string, writeAccess: boolean) {
  try {
    const response = await axiosDefault.put(`/api/users/${userId}/write-access`, { writeAccess });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
