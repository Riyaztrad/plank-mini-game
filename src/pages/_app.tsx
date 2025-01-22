import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';

import { getOrCreateUser, validateHash } from '../services/user.service';
import { TelegramUser } from '../types/user.interface';
import MainLayout from '../components/common/main-layout';
import { getUserFromTelegram } from '../lib/utils';
import { useUserStore } from '../store/userStore';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Toaster } from '../components/ui/toaster';

function MyApp({ Component, pageProps }: AppProps) {
  const [isHashValid, setIsHashValid] = useState(false);
  const hasInitializedRef = useRef(false); // Ref to prevent double call
  const { setUser } = useUserStore();

  useEffect(() => {
    if (!hasInitializedRef.current) {
      startApp();
      hasInitializedRef.current = true; // Set ref after function is called
    }
  }, []);

  const startApp = async () => {
    // 1. Wait for hash validation to complete before rendering the page
    // if (process.env.NODE_ENV !== 'production') {
    setIsHashValid(true);
    // } else {
    //   const isValid = await validateHash(window.Telegram.WebApp.initData);
    //   setIsHashValid(isValid);
    // }

    // 2. Get the Telegram user and store it in the database
    const user = getUserFromTelegram();

    // URL format for referrals is {botUrl}/start?startapp=dojotg588762033
    const rawDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    console.log('rawDataUnsafe', rawDataUnsafe);
    const newUser = await getOrCreateUser(
      { ...user, id: user.id.toString() },
      rawDataUnsafe.start_param
    );
    if (newUser) {
      setUser(newUser);
    }
  };

  if (!isHashValid) {
    return null;
  }

  return (
    <MainLayout>
      <TonConnectUIProvider
        manifestUrl={`${'https://plank-mini-game.onrender.com/home'}/tonconnect-manifest.json`}
        actionsConfiguration={{
          twaReturnUrl: 'https://t.me/plank_rocket_bot' as `${string}://${string}`,
        }}>
        <Component {...pageProps} />
        <Toaster />
      </TonConnectUIProvider>
    </MainLayout>
  );
}

export default MyApp;
