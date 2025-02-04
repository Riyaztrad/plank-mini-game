import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user.interface';

interface UserState {
  // referralCode: string;
  // setReferralCode: (referralCode: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  userGame: string;
  setUserGame: (userGame: string) => void;
  // leaderboard: LeaderboardUser[];
  // setLeaderboard: (leaderboard: LeaderboardUser[]) => void;
  // tiers: Tier[];
  // setTiers: (tiers: Tier[]) => void;
  // completeMission: (missionId: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      userGame: '',
      setUserGame: (userGame) => set({ userGame }),
    }),
    {
      name: 'userStore',
    }
  )
);
