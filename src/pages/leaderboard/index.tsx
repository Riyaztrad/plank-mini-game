import type { NextPage } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// import Link from 'next/link';
import AstronautImage from '../../assets/images/astronaut.png';
import GlobeImage from '../../assets/images/globe.png';
import CommunityTab from '../../components/common/community-tab';
import CreateSquadDrawer from '../../components/common/create-squad-drawer';
import GlobalTab from '../../components/common/global-tab';
import Navbar from '../../components/common/navbar';
import TabButton from '../../components/common/tab-button';
import { createSquad, getSquads } from '../../services/squad.service';
import { getPointsLeaderboard, getScoreLeaderboard } from '../../services/user.service';
import { useUserStore } from '../../store/userStore';
import { Squad } from '../../types/squad.interface';
import { LeaderboardUser } from '../../types/user.interface';

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
    <div className="fixed left-0 top-0 flex h-screen w-screen flex-col overflow-y-auto bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat p-5">
      {user?.league && (
        <div className="mb-3 flex items-center justify-center gap-4">
          <Image src={user.league.image} alt={user.league.title} width={40} height={40} />
          <p className="font-gumdrop text-[24px] uppercase">{user.league.title} League</p>
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-[10px]">
        <TabButton
          text="Top in global"
          image={GlobeImage}
          selected={activeTab === 0}
          onClick={() => setActiveTab(0)}
        />
        <TabButton
          text="Top in community"
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
