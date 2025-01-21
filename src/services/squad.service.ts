import { axiosDefault } from '../lib/axios';
import { Squad, SquadData, SquadUserRanking } from '../types/squad.interface';

export async function getSquads(userId: string): Promise<Squad[]> {
  try {
    const response = await axiosDefault.get(`/api/squads?user=${userId}`);
    return response.data.squads;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getSquadData(userId: string, squadId: number): Promise<SquadData | null> {
  try {
    const response = await axiosDefault.get(`/api/squads/${squadId}?user=${userId}`);
    return response.data.squad;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function getUserSquadRanking(
  userId: string,
  squadId: number
): Promise<SquadUserRanking | null> {
  try {
    const response = await axiosDefault.get(`/api/squads/${squadId}/users/${userId}`);
    return response.data.user;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function joinSquad(userId: string, squadId: number) {
  try {
    const response = await axiosDefault.post(`/api/squads/${squadId}/join`, { userId });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function leaveSquad(userId: string, squadId: number) {
  try {
    const response = await axiosDefault.post(`/api/squads/${squadId}/leave`, { userId });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function createSquad(handle: string) {
  try {
    const response = await axiosDefault.post(`/api/squads/create`, { handle });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
