import type { NextPage } from 'next';

import { useUserStore } from '../../store/userStore';
import Navbar from '../../components/common/navbar';
import UserBalance from '../../components/common/user-balance';
import { UserBoost } from '../../components/common/user-boost';
import { Button } from '../../components/ui/button';
import { useEffect, useState } from 'react';
import LeagueDrawer from '../../components/common/league-drawer';
import { League } from '../../types/league.interface';
import { getLeagues } from '../../services/task.service';
import LeaguePreview from '../../components/common/user-league';
import Link from 'next/link';
import { claimDailyRewards, createUserGame, getUserData } from '../../services/user.service';
import PurchaseStarsDrawer from '../../components/common/purchase-stars-drawer';
import DailyCheckInDrawer from '../../components/common/daily-check-in-drawer';
import Image from 'next/image';
import RocketImage from '../../assets/images/rocket.png';
import { DailyRewards } from '../../types/reward.interface';
import { useRouter } from 'next/router';
import { generateKey, encrypt } from '../../lib/crypto';

const Home: NextPage = () => {
  const { user, setUser, setUserGame } = useUserStore();
  const router = useRouter();
  const [leagueDrawerOpen, setLeagueDrawerOpen] = useState(false);
  const [starsDrawerOpen, setStarsDrawerOpen] = useState(false);
  const [dailyDrawerOpen, setDailyDrawerOpen] = useState(false);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [rewards, setRewards] = useState<DailyRewards>();

  useEffect(() => {
    getLeaguesFromApi();
  }, []);

  useEffect(() => {
    if (user) {
      claimDailyRewardsFromApi(user.id);
    }
  }, [user]);

  const getLeaguesFromApi = async () => {
    if (!user) return;

    const res = await getLeagues(user.id);
    setLeagues(res);
  };

  const claimDailyRewardsFromApi = async (userId: string) => {
    const res = await claimDailyRewards(userId);
    if (res && res.displayDrawer) {
      setRewards(res);
      setDailyDrawerOpen(true);

      const updatedUser = await getUserData(userId);
      setUser(updatedUser);
    }
  };

  const createGameInDb = async () => {
    if (!user) return;

    if (user.boosts[0].amount <= 0) {
      router.push('/store');
    } else {
      const first3 = user?.id.slice(0, 3);
      const rawKey = `${generateKey(user?.id || '')}`; // `${a.slice(0, 3)}:${b}:${c}:${a.slice(-3)}`;

      const key = encrypt(rawKey, `${first3}${process.env.NEXT_PUBLIC_SECRET_TOKEN}`);

      const gameId = await createUserGame(user.id, key);
      if (gameId !== '') {
        // (window as any).Telegram.WebApp.showAlert(`GameId ${gameId}`);
        setUserGame(gameId);
      }

      router.push('/game');
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat flex flex-col px-5 py-3 overflow-y-auto">
      <div className="rounded-xl bg-[#1C8F88]" style={{paddingLeft:"5px",paddingRight:"5px"}}>
        <div className="relative rounded-xl bg-[url('/spaceship.png')] bg-cover bg-center bg-no-repeat h-[410px]">
          <Image
            src={RocketImage}
            alt="rocket"
            width={200}
            height={200}
            className="absolute top-[160px] left-[80px] w-[170px] h-[190px] floating transform -translate-x-1/2 -translate-y-1/2"
          />
          <div className="px-2 absolute top-0 w-full flex items-center justify-between gap-2 mt-2">
            <UserBalance title="Top Score" amount={user?.maxScore || 0} />
            <UserBalance title="Coins Score" amount={user?.points || 0} />
          </div>
          {/* {user && (
            <div
              className="absolute bottom-3 w-full flex items-center justify-between cursor-pointer"
              onClick={() => setLeagueDrawerOpen(true)}>
              <LeaguePreview league={user.league} />
            </div>
          )} */}
        </div>
        <div>
          <p className="text-center text-[15px] font-gumdrop" style={{paddingBottom:"50px",fontFamily:'Genos',fontWeight:700,fontSize:'30px',lineHeight:'36.51px',marginTop:'10px'}}>Inventory</p>
          {/* <Link className="flex justify-center gap-2 items-center mt-1 mb-2 px-2" href={'/store'}>
            {user?.boosts &&
              user?.boosts.map((boost, index) => <UserBoost key={index} boost={boost} />)}
          </Link> */}
        </div>
      </div>

      <Button className="w-full uppercase mt-2" variant={'blue'} onClick={createGameInDb} style={{marginTop:'15px'}}>
        Launch
      </Button>

      <div className="mt-auto">
        <Navbar />
      </div>

      {user && (
        <>
          <LeagueDrawer
            leagues={leagues}
            userLeague={user.league}
            open={leagueDrawerOpen}
            setOpen={setLeagueDrawerOpen}
          />
          <PurchaseStarsDrawer open={starsDrawerOpen} setOpen={setStarsDrawerOpen} />
          <DailyCheckInDrawer
            open={dailyDrawerOpen}
            setOpen={setDailyDrawerOpen}
            rewards={rewards}
          />
        </>
      )}
    </div>
  );
};

export default Home;
