import React, { useState } from 'react';
import IconHeartRed from '../../assets/icons/icon-heart-red';

import SuccessPage from '../../components/common/success-page';
import { Button } from '../../components/ui/button';

const Page = () => {
  const [dailyCheckSuccess, setDailyCheckSuccess] = useState(false);
  const [taskSuccess, setTaskSuccess] = useState(false);

  if (taskSuccess) {
    return (
      <SuccessPage onClose={() => setTaskSuccess(false)} className="flex flex-col">
        <div className="grow flex flex-col items-center justify-center">
          <div className="text-[96px] font-bold font-gumdrop">5</div>
          <div className="text-[24px] font-bold mt-5 text-center">
            5 Second Time <br />
            Bonus Unlocked
          </div>
          <div className="text-[20px] mt-5 text-center">
            This extra time will be added <br />
            to your next game
          </div>
        </div>
        <div className="border-2 border-primary bg-gradient-card flex items-center gap-10 py-5 rounded-lg justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/50">Plays</span>
            <div className="py-1 px-3 flex items-center gap-1 text-danger border border-danger rounded-full">
              <IconHeartRed />
              <span>+1</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/50">Points</span>
            <div className="text-[24px] font-bold">+5</div>
          </div>
        </div>
      </SuccessPage>
    );
  }

  if (dailyCheckSuccess) {
    return (
      <SuccessPage onClose={() => setDailyCheckSuccess(false)} className="flex flex-col">
        <div className="grow flex flex-col items-center justify-center">
          <div className="text-[96px] font-bold font-gumdrop">1</div>
          <div className="text-[24px] font-bold text-center">day check-in</div>
        </div>
        <div className="border-2 border-primary bg-gradient-card flex items-center gap-10 py-5 rounded-lg justify-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-white/50">Plays</span>
            <div className="py-1 px-3 flex items-center gap-1 text-danger border border-danger rounded-full">
              <IconHeartRed />
              <span>+1</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/50">Points</span>
            <div className="text-[24px] font-bold">+5</div>
          </div>
        </div>
      </SuccessPage>
    );
  }

  return (
    <div className="space-y-5 h-full flex flex-col justify-center">
      <Button className="w-full" onClick={() => setDailyCheckSuccess(true)}>
        Daily check success
      </Button>
      <Button className="w-full" onClick={() => setTaskSuccess(true)}>
        Task success
      </Button>
    </div>
  );
};

export default Page;
