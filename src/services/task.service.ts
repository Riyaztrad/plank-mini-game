import { axiosDefault } from '../lib/axios';
import { Task } from '../types/task.interface';
import { League } from '../types/league.interface';
import { CompleteTaskResponse } from '../pages/api/tasks/[taskId]';

export async function getTasks(userId: string): Promise<Task[]> {
  try {
    const response = await axiosDefault.get(`/api/tasks?user=${userId}`);
    return response.data.tasks;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getLeagues(userId: string): Promise<League[]> {
  try {
    const response = await axiosDefault.get(`/api/leagues?user=${userId}`);
    return response.data.leagues;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function completeTask(
  userId: string,
  taskId: number
): Promise<CompleteTaskResponse | null> {
  try {
    const response = await axiosDefault.post(`/api/tasks/${taskId}`, { userId });
    return response.data.rewards as CompleteTaskResponse;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export async function claimLeague(userId: string, leagueId: number) {
  try {
    const response = await axiosDefault.post(`/api/leagues/${leagueId}`, { userId });
    return response.data.completed;
  } catch (err) {
    console.log(err);
    return false;
  }
}
