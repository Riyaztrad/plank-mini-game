import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TelegramUser } from '../types/user.interface';

export const formatEthereumAddress = (address: string, size: number = 3) => {
  const len = address.length;

  return `${address.slice(0, size + 2)}...${address.slice(len - size, len)}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUserFromTelegram = (): TelegramUser => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      id: '588762033',
      first_name: 'Nomad3v.eth',
      last_name: '',
      username: 'nomad3v',
    };
  }
  const initData = window.Telegram.WebApp.initData;

  const rawData = decodeURI(initData);
  const params = new URLSearchParams(rawData); // Split the decoded string into key-value pairs (there are more, not only user)
  const userStr = params.get('user') || ''; // Extract and parse the 'user' parameter as JSON
  const user = JSON.parse(userStr) as TelegramUser;

  return user;
};

export const createShareLink = (referralCode: string) => {
  let url = `${process.env.NEXT_PUBLIC_BOT_URL}`;
  if (referralCode && referralCode !== '') {
    url += `?startapp=${referralCode}`;
  }
  const text = 'Use this link to join the game and get a welcome bonus!';
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`;
};

export const createRawLink = (referralCode: string) => {
  let url = `${process.env.NEXT_PUBLIC_BOT_URL}`;
  if (referralCode && referralCode !== '') {
    url += `?startapp=${referralCode}`;
  }
  return url;
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
