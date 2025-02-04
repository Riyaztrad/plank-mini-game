import React, { useState } from 'react';
import { LeaderboardUser } from '../../types/user.interface';
import { useUserStore } from '../../store/userStore';
import UserItem from './user-item';
import Image from 'next/image';
import CoinImage from '../../assets/images/coin.png';
import TopScoreImage from '../../assets/images/top-score.png';
import clsx from 'clsx';

type Props = {
  scoreLeaderboard: LeaderboardUser[];
  pointsLeaderboard: LeaderboardUser[];
};

const GlobalTab = ({ scoreLeaderboard, pointsLeaderboard }: Props) => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="">
      <div className="flex gap-2 my-3">
        <div className="flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px] border-2 border-[#0D4C60]">
          <div className="font-gumdrop text-[#3FFECF] text-[20px] text-center">
            {activeTab === 0 ? user?.maxScoreRanking : user?.pointsRanking}
          </div>
          <div className="grow flex items-center gap-3">
            <div
              className={`w-[40px] h-[40px] flex items-center justify-center font-tacticSans font-bold rounded-full bg-[#286EF0]`}>
              {user?.username.charAt(0).toUpperCase()}
            </div>

            <div className="">
              <p className="font-gumdrop text-[20px] line-clamp-1">{user?.username}</p>
              <p className="font-gumdrop text-[12px] text-[#02a3b5]">
                {activeTab === 0 ? user?.maxScore : user?.points}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-40">
          <button
            className={clsx(
              'text-[12px] font-gumdrop px-2 py-1 border-2 border-[#0D4C60] rounded-full flex items-center gap-2 justify-center',
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
              className="w-4 h-auto"
            />
            Top score
          </button>

          <button
            className={clsx(
              'text-[12px] font-gumdrop px-2 py-1 border-2 border-[#0D4C60] rounded-full flex items-center gap-2 justify-center',
              activeTab === 1
                ? 'bg-gradient-to-b from-[#3FFECF] to-[#4D6E75] text-white'
                : 'bg-[#063341] text-[#9badb3]'
            )}
            onClick={() => setActiveTab(1)}>
            <Image src={CoinImage} alt="coin" width={120} height={120} className="w-4 h-auto" />
            Coins
          </button>
        </div>
      </div>

      {activeTab === 0 ? (
        <div
          className="grow overflow-auto flex flex-col gap-3"
          style={{ maxHeight: 'calc(100vh - 320px)' }}>
          {scoreLeaderboard.map((user, i) => (
            <UserItem user={user} key={i} index={i + 1} />
          ))}
        </div>
      ) : (
        <div
          className="grow overflow-auto flex flex-col gap-3"
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
