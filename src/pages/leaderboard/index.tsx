import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
// import Link from 'next/link';
import { getPointsLeaderboard, getScoreLeaderboard } from '../../services/user.service';
import { LeaderboardUser } from '../../types/user.interface';
import { useUserStore } from '../../store/userStore';
import { createSquad, getSquads } from '../../services/squad.service';

import { Squad } from '../../types/squad.interface';
import GlobalTab from '../../components/common/global-tab';
import CommunityTab from '../../components/common/community-tab';
import Navbar from '../../components/common/navbar';
import TabButton from '../../components/common/tab-button';
import AstronautImage from '../../assets/images/astronaut.png';
import GlobeImage from '../../assets/images/globe.png';
import CreateSquadDrawer from '../../components/common/create-squad-drawer';
import Image from 'next/image';

const Leaderboard: NextPage = () => {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState(0);
  const [scoreLeaderboard, setScoreLeaderboard] = useState<LeaderboardUser[]>([]);
  const [pointsLeaderboard, setPointsLeaderboard] = useState<LeaderboardUser[]>([]);
  const [communities, setCommunities] = useState<Squad[]>([]);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  useEffect(() => {
    getLeaderboardFromApi();
    getCommunitiesFromApi();
  }, []);

  const getLeaderboardFromApi = async () => {
    if (!user) return;
    const score = await getScoreLeaderboard(user.id);
    setScoreLeaderboard(score);

    const points = await getPointsLeaderboard(user.id);
    setPointsLeaderboard(points);
  };

  const getCommunitiesFromApi = async () => {
    if (user) {
      const res = await getSquads(user.id);
      setCommunities(res);
    }
  };

  const reloadData = async () => {
    getCommunitiesFromApi();
    setCreateDrawerOpen(false);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col p-5 overflow-y-auto">
      {user?.league && (
        <div className="flex items-center justify-center gap-4 mb-3">
          <Image src={user.league.image} alt={user.league.title} width={40} height={40} />
          <p className="font-gumdrop uppercase text-[24px]">{user.league.title} League</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-[10px] mt-3">
        <TabButton
          text={'Top in global'}
          image={GlobeImage}
          selected={activeTab === 0}
          onClick={() => setActiveTab(0)}
        />
        <TabButton
          text={'Top in community'}
          image={AstronautImage}
          selected={activeTab === 1}
          onClick={() => setActiveTab(1)}
        />
      </div>

      {activeTab === 0 ? (
        <GlobalTab scoreLeaderboard={scoreLeaderboard} pointsLeaderboard={pointsLeaderboard} />
      ) : (
        <CommunityTab communities={communities} onCreateSquad={() => setCreateDrawerOpen(true)} />
      )}

      <CreateSquadDrawer
        open={createDrawerOpen}
        setOpen={setCreateDrawerOpen}
        onCreateSquad={reloadData}
      />

      <div className="mt-auto">
        <Navbar />
      </div>
    </div>
  );
};

export default Leaderboard;
