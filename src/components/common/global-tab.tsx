import clsx from 'clsx';
import Image from 'next/image';
import React, { useState } from 'react';

import UserItem from './user-item';
import CoinImage from '../../assets/images/coin.png';
import TopScoreImage from '../../assets/images/top-score.png';
import { useUserStore } from '../../store/userStore';
import { LeaderboardUser } from '../../types/user.interface';

type Props = {
  scoreLeaderboard: LeaderboardUser[];
  pointsLeaderboard: LeaderboardUser[];
};

const GlobalTab = ({ scoreLeaderboard, pointsLeaderboard }: Props) => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="">
      <div className="my-3 flex gap-2">
        <div className="flex w-full items-center gap-3 rounded-[12px] border-2 border-[#0D4C60] bg-[#063341] px-[20px] py-[10px]">
          <div className="text-center font-gumdrop text-[20px] text-[#3FFECF]">
            {activeTab === 0 ? user?.maxScoreRanking : user?.pointsRanking}
          </div>
          <div className="flex grow items-center gap-3">
            <div className="flex size-[40px] items-center justify-center rounded-full bg-[#286EF0] font-tacticSans font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>

            <div className="">
              <p className="line-clamp-1 font-gumdrop text-[20px]">{user?.username}</p>
              <p className="font-gumdrop text-[12px] text-[#02a3b5]">
                {activeTab === 0 ? user?.maxScore : user?.points}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-40 flex-col gap-1">
          <button
            className={clsx(
              'flex items-center justify-center gap-2 rounded-full border-2 border-[#0D4C60] px-2 py-1 font-gumdrop text-[12px]',
              activeTab === 0
                ? 'bg-gradient-to-b from-[#3FFECF] to-[#4D6E75] text-white'
                : 'bg-[#063341] text-[#9badb3]'
            )}
            onClick={() => setActiveTab(0)}>
            <Image
              src={TopScoreImage}
              alt="score"
              width={120}
              height={120}
              className="h-auto w-4"
            />
            Top score
          </button>

          <button
            className={clsx(
              'flex items-center justify-center gap-2 rounded-full border-2 border-[#0D4C60] px-2 py-1 font-gumdrop text-[12px]',
              activeTab === 1
                ? 'bg-gradient-to-b from-[#3FFECF] to-[#4D6E75] text-white'
                : 'bg-[#063341] text-[#9badb3]'
            )}
            onClick={() => setActiveTab(1)}>
            <Image src={CoinImage} alt="coin" width={120} height={120} className="h-auto w-4" />
            Coins
          </button>
        </div>
      </div>

      {activeTab === 0 ? (
        <div
          className="flex grow flex-col gap-3 overflow-auto"
          style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {scoreLeaderboard.map((user, i) => (
            <UserItem user={user} key={i} index={i + 1} />
          ))}
        </div>
      ) : (
        <div
          className="flex grow flex-col gap-3 overflow-auto"
          style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {pointsLeaderboard.map((user, i) => (
            <UserItem user={user} key={i} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalTab;
