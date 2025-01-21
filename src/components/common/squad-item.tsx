import React, { useState } from 'react';
import { AppColors } from '../../data/constants';
import { Check, ChevronRight } from 'lucide-react';
import { Squad, SquadData, SquadUserRanking } from '../../types/squad.interface';
import { getSquadData, getUserSquadRanking } from '../../services/squad.service';
import { useUserStore } from '../../store/userStore';
import SquadDetailsDrawer from './squad-details-drawer';

type Props = {
  squad: Squad;
  onJoin: () => void;
};

const SquadItem = ({ squad, onJoin }: Props) => {
  const { user } = useUserStore();
  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [squadData, setSquadData] = useState<SquadData>();
  const [userRanking, setUserRanking] = useState<SquadUserRanking>();

  const handleJoinSquad = async () => {};

  const handleLeaveSquad = async () => {};

  const handleViewSquad = async () => {
    if (!user) return;

    const data = await getSquadData(user.id, squad.id);
    if (data) {
      setSquadData(data);
    }

    const res = await getUserSquadRanking(user.id, squad.id);
    if (res) {
      setUserRanking(res);
    }

    setUsersModalOpen(true);
  };

  return (
    <div className="flex items-center gap-3 w-full bg-[#063341] rounded-[12px] px-[20px] py-[10px]">
      <div className="font-gumdrop text-[#3FFECF] text-[20px] text-center">
        {squad.id.toString().padStart(1, '0')}
      </div>
      <div className="grow flex items-center gap-3">
        {!squad.joined ? (
          <div
            className={`w-[40px] h-[40px] flex items-center justify-center font-tacticSans font-bold rounded-full`}
            style={{ backgroundColor: AppColors[squad.id % AppColors.length] }}>
            {squad.title.charAt(0).toUpperCase()}
          </div>
        ) : (
          <div
            className={`w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#3FFECF]`}>
            <Check className="h-4 text-black" />
          </div>
        )}
        <div className="">
          <p className="font-gumdrop text-[20px] line-clamp-1">{squad.title}</p>
          <p className="font-gumdrop text-[12px] text-[#02a3b5]">{squad.totalUsers} members</p>
        </div>
      </div>

      <ChevronRight onClick={handleViewSquad} className="cursor-pointer pulsing" />

      {squadData && userRanking && (
        <SquadDetailsDrawer
          open={usersModalOpen}
          setOpen={setUsersModalOpen}
          squad={squadData}
          userRanking={userRanking}
          joined={squad.joined}
          onJoinSquad={handleJoinSquad}
          onLeaveSquad={handleLeaveSquad}
        />
      )}
    </div>
  );
};

export default SquadItem;
