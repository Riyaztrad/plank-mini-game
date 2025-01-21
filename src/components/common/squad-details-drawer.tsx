import { useState } from 'react';
import { Drawer, DrawerContent } from '../../components/ui/drawer';
import { joinSquad, leaveSquad } from '../../services/squad.service';
import Image from 'next/image';
import CoinImage from '../../assets/images/coin.png';
import TopScoreImage from '../../assets/images/top-score.png';
import { SquadData, SquadUserRanking } from '../../types/squad.interface';
import { AppColors } from '../../data/constants';
import IconMedal from '../../assets/icons/icon-medal';
import IconFrens from '../../assets/icons/icon-frens';
import IconTelegram from '../../assets/icons/icon-telegram';
import { useUserStore } from '../../store/userStore';
import UserItem from './user-item';
import { createShareLink } from '../../lib/utils';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../ui/button';

export default function SquadDetailsDrawer({
  squad,
  open,
  joined,
  userRanking,
  setOpen,
  onJoinSquad,
  onLeaveSquad,
}: {
  squad: SquadData;
  open: boolean;
  joined: boolean;
  userRanking: SquadUserRanking;
  setOpen: (open: boolean) => void;
  onJoinSquad: () => void;
  onLeaveSquad: () => void;
}) {
  const { user } = useUserStore();
  const [hasJoined, setHasJoined] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleJoinSquad = async () => {
    if (user && !joined) {
      await joinSquad(user.id, squad.id);
      setHasJoined(true);
    }

    onJoinSquad();
    setOpen(false);
  };

  const handleLeaveSquad = async () => {
    if (user && !joined) {
      await leaveSquad(user.id, squad.id);
      setHasJoined(false);
    }

    onLeaveSquad();
    setOpen(false);
  };

  const createInviteLink = () => {
    const referralCode = user?.code || '';
    return createShareLink(referralCode);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-black border-none text-white font-inter">
        <div className="p-5">
          <div className="flex items-center gap-4 justify-center">
            <div
              className={`w-[40px] h-[40px] flex items-center justify-center font-tacticSans font-bold rounded-full text-[24px]`}
              style={{ backgroundColor: AppColors[squad.id % AppColors.length] }}>
              {squad.title.charAt(0).toUpperCase()}
            </div>
            <div className="text-[18px] font-bold">@{squad.title}</div>
          </div>

          <div className="grid grid-cols-3 gap-[10px] mt-4">
            <div className="border-2 border-primary rounded-2xl flex flex-col items-center gap-1 py-3 bg-gradient-card">
              <IconMedal />
              <span>{squad.ranking}</span>
            </div>
            <div className="border-2 border-primary rounded-2xl flex flex-col items-center gap-1 py-3 bg-gradient-card">
              <IconFrens />
              <span>{squad?.totalUsers}</span>
            </div>
            <a
              className="border-2 border-primary rounded-2xl flex flex-col items-center gap-1 py-3 bg-gradient-card"
              href={squad?.externalUrl}>
              <IconTelegram />
              <span>Visit</span>
            </a>
          </div>

          <div className="flex justify-between items-center gap-2 my-2">
            <a href={createInviteLink()} className="w-full">
              <Button className="w-full py-1" variant={'silver'}>
                Invite fren
              </Button>
            </a>
            {joined || hasJoined ? (
              <Button className="w-full py-1" variant={'silver'} onClick={handleLeaveSquad}>
                Leave squad
              </Button>
            ) : (
              <Button className="w-full py-1" variant={'silver'} onClick={handleJoinSquad}>
                Join squad
              </Button>
            )}
          </div>

          <div className="flex gap-2 mb-3">
            <div className="flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px] border-2 border-[#0D4C60]">
              <div className="font-gumdrop text-[#3FFECF] text-[20px] text-center">
                {activeTab === 0 ? userRanking?.maxScoreRanking : user?.pointsRanking}
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
            <div className="grow overflow-auto flex flex-col gap-3 h-[260px]">
              {squad.maxScoreUsers.map((user, i) => (
                <UserItem user={user} key={i} index={i + 1} />
              ))}
            </div>
          ) : (
            <div className="grow overflow-auto flex flex-col gap-3 h-[260px]">
              {squad.pointsUsers.map((user, i) => (
                <UserItem user={user} key={i} index={i + 1} />
              ))}
            </div>
          )}
        </div>

        <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
