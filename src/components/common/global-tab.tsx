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
// ye solve krona 
  return (
    <div className="">
      <div className="flex gap-2 my-3">
        <div className="flex items-center gap-3 w-[272px] h-[78px] bg-[#063341] rounded-[9px] px-[20px] py-[10px] border-1 border-[#0D4C60]">
       

          <div className="font-gumdrop text-[#00FFFF] text-[32px] font-bold leading-[13.76px] tracking-[-0.02em] text-left">
            {activeTab === 0 ? user?.maxScoreRanking : user?.pointsRanking}
          </div>
          <div className="grow flex items-center gap-3">
            <div
              className={`w-[43px] h-[43px] text-[32px]leading-[36.51px]tracking-[-0.02em] text-left flex items-center justify-center font-Genos font-bold rounded-[5px]  bg-[#00BEB3]`}>
              {user?.username.charAt(0).toUpperCase()}
            </div>
             <div className="w-[64px]h-[34px] gap-[3px]">

              <p className="font-Genos text-[24px] font-bold leading-[16.32px]tracking-[-0.02em] text-left">{user?.username}</p>
              <p className="font-Genos text-[18px]font-bold leading-[12.24px]tracking-[-0.02em]  text-left text-[#00BEB3]">

                {activeTab === 0 ? user?.maxScore : user?.points}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-40 flex-col gap-1">
          <button
            className={clsx(
              'text-[18.16px] w-[107px] h-[34.8px]  font-genos p-7.4  border-[0.74px] border-[#FFFFFF] rounded-[6.66px] flex items-center gap-[5.18px] justify-center',
              activeTab === 0
                ? 'bg-gradient-to-b from-[#3FFECF] to-[#4D6E75] text-white'
                : 'bg-[#063341] text-[#FFFFFF]'
            )}
            onClick={() => setActiveTab(0)}>
            
            Top score 
          </button>

          <button
            className={clsx(
              'text-[18.16px] w-[107px] h-[34.8px]  font-genos p-7.4  border-[0.74px] border-[#FFFFFF] rounded-[6.66px] flex items-center gap-[5.18px] justify-center',
              activeTab === 1
                ? 'bg-gradient-to-b from-[#3FFECF] to-[#4D6E75] text-white'
                : 'bg-[#063341] text-[#FFFFFF]'
            )}
            onClick={() => setActiveTab(1)}>
            
            Coins
          </button>
        </div>
      </div>

      {activeTab === 0 ? (
        <div
          className="grow overflow-auto flex flex-col gap-3 "
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
