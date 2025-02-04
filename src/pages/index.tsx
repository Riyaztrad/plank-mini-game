'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { updateWriteAccess } from '../services/user.service';

const LoadingTime = 5000; // 5s
const TimerInterval = 100;

const Page = () => {
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const webapp = window.Telegram?.WebApp as any;

    if (webapp?.requestWriteAccess) {
      try {
        webapp.requestWriteAccess(async (result: boolean) => {
          await updateWriteAccess(webapp.initDataUnsafe.user?.id, result);
        });
      } catch (error) {
        console.log('[error]: ', 'Failed to request write access', error);
      }
    }
  }, [window.Telegram?.WebApp]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setProgress((prev) => {
        const value = prev + 100 / (LoadingTime / TimerInterval);
        if (value === 120) {
          clearInterval(timerId);
          // if (user?.displayDailyCheckIn) {
          //   router.push('/daily-check-in');
          // } else {
          router.push('/home');
          // }
        }
        return value;
      });
    }, TimerInterval);

    return () => clearInterval(timerId);
  }, [router]);

  return (
    <div className="fixed left-0 top-0 z-20 flex h-screen w-screen flex-col items-center justify-center bg-[url('/bg-loading.png')] bg-cover bg-top bg-no-repeat">
      <Head>
        <title>DevStudios Telegram Web App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Image src="/logo.png" alt="logo" width={285} height={237} /> */}
      <div className="absolute bottom-10 w-[180px] rounded-lg border-[3px] border-primary p-1">
        <div
          className="h-[15px] rounded-sm bg-white"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
};

export default Page;
