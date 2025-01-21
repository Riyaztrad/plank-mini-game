'use client';

import { useEffect, useRef, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import {
  createUserGame,
  getUserData,
  updateBoostCount,
  updateUserPoints,
} from '../../services/user.service';
import { useRouter } from 'next/navigation';
import { Spinner } from '../../components/common/spinner';
import { encrypt, generateKey } from '../../lib/crypto';

declare global {
  interface Window {
    createUnityInstance: any;
  }
}

export default function Game() {
  const { user, setUser, userGame, setUserGame } = useUserStore();
  const router = useRouter();
  const unityInstanceRef = useRef<any>(null); // Use ref instead of state
  const hasUpdatedUserRef = useRef(false); // Ref to prevent double call
  const lastGameId = useRef(userGame);

  useEffect(() => {
    if (!user) return;
    unityInstanceRef.current = false;

    const handleLoadGame = () => {
      if (unityInstanceRef.current) return;
      unityInstanceRef.current = true;

      const script = document.createElement('script');
      script.src = 'Build/EstateX_Build.loader.js';
      script.onload = () => {
        window
          .createUnityInstance(document.querySelector('#unity-canvas'), {
            dataUrl: 'Build/EstateX_Build.data',
            frameworkUrl: 'Build/EstateX_Build.framework.js',
            codeUrl: 'Build/EstateX_Build.wasm',
            streamingAssetsUrl: 'StreamingAssets',
            companyName: 'DefaultCompany',
            productName: 'EstateX',
            productVersion: '1.0',
          })
          .then((instance: any) => {
            sendScoreToUnity(instance);
            unityInstanceRef.current = instance;
          });
      };
      document.body.appendChild(script);
    };

    console.log('[GAME] Loading Unity instance...');
    handleLoadGame();

    const handleMessage = async (event: any) => {
      console.log('[GAME] handleMessage', hasUpdatedUserRef.current);
      if (hasUpdatedUserRef.current) return;

      console.log('[GAME] Received message:', event.data);

      try {
        const { points, playCoins, timeCoins, boostCoins, shieldCoins, magnetCoins } = JSON.parse(
          event.data
        );

        if (points <= 0) {
          console.log('Points: ', points, ' updating boosts');
          await updateBoostCount(
            user?.id || '',
            playCoins || 0,
            timeCoins || 0,
            boostCoins || 0,
            shieldCoins || 0,
            magnetCoins || 0
          );
        } else {
          if (!lastGameId.current) return;

          hasUpdatedUserRef.current = true;

          const first3 = user?.id.slice(0, 3);
          const rawKey = `${generateKey(user?.id || '')}`; // `${a.slice(0, 3)}:${b}:${c}:${a.slice(-3)}`;

          const key = encrypt(rawKey, `${first3}${process.env.NEXT_PUBLIC_SECRET_TOKEN}`);
          await updateUserPoints(user?.id || '', points, lastGameId.current as string, key);
        }
      } catch (error) {
        console.error('Failed to parse message from Unity game:', error);
      }
    };

    const handleExitGame = async (event: any) => {
      console.log('Received EXIT:', event.detail);
      if (unityInstanceRef.current) {
        await unityInstanceRef.current.Quit();
        unityInstanceRef.current = null;
      }

      if (user) {
        const updatedUser = await getUserData(user.id);
        if (updatedUser) {
          setUser(updatedUser);
        }
      }

      const { destination } = event.detail;
      setTimeout(() => {
        if (destination === 'shop') {
          router.push('/store');
        } else if (destination === 'task') {
          router.push('/tasks');
        } else {
          router.push('/home');
        }
      }, 1500);
    };

    const handlePlayAgain = async (event: any) => {
      if (!user) return;

      hasUpdatedUserRef.current = false;

      const first3 = user?.id.slice(0, 3);
      const rawKey = `${generateKey(user?.id || '')}`; // `${a.slice(0, 3)}:${b}:${c}:${a.slice(-3)}`;

      const key = encrypt(rawKey, `${first3}${process.env.NEXT_PUBLIC_SECRET_TOKEN}`);

      const gameId = await createUserGame(user.id, key);
      console.log('gameId', gameId);
      if (gameId !== '') {
        lastGameId.current = gameId;
        setUserGame(gameId);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('unityReplayEvent', handlePlayAgain);
    window.addEventListener('unityExitEvent', handleExitGame);

    return () => {
      console.log('[GAME] Cleaning up...');

      // Clean up Unity instance
      if (unityInstanceRef.current && typeof unityInstanceRef.current.Quit === 'function') {
        console.log('[GAME] Quitting Unity instance');
        unityInstanceRef.current.Quit();
      }
      unityInstanceRef.current = null;

      // Remove event listeners
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('unityReplayEvent', handlePlayAgain);
      window.removeEventListener('unityExitEvent', handleExitGame);

      console.log('[GAME] Cleanup complete');
    };
  }, [router, user]);

  const sendScoreToUnity = (unityInstance: any) => {
    const gameData = {
      points: user?.points || 0,
      playCoins: Math.max((user?.boosts[0].amount || 0) - 1, 0),
      timeCoins: user?.boosts[1].amount || 0,
      boostCoins: user?.boosts[2].amount || 0,
      shieldCoins: user?.boosts[3].amount || 0,
      magnetCoins: user?.boosts[4].amount || 0,
      playerName: user?.username || '',
      topScore: user?.maxScore || 0,
    };

    if (unityInstance) {
      console.log('Sent to game:', gameData);
      unityInstance.SendMessage(
        'BackendCommunicationManager',
        'ReceivePlayerData',
        JSON.stringify(gameData)
      );
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat flex justify-center items-center">
      <canvas id="unity-canvas" className="size-full relative" />
      <Spinner className="animate-spin mr-2 text-primary absolute -z-50" />
    </div>
  );
}
