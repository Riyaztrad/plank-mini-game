import { Drawer, DrawerContent } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { LeagueItem } from './league-item';
import { League } from '../../types/league.interface';
import { UserLeague } from '../../types/user.interface';
import { useState } from 'react';
import RewardsDrawer from './rewards-drawer';
import { useUserStore } from '../../store/userStore';
import { claimLeague } from '../../services/task.service';
import { getUserData } from '../../services/user.service';
import { useToast } from '../../hooks/use-toast';

export default function LeagueDrawer({
  userLeague,
  leagues,
  open,
  setOpen,
}: {
  userLeague: UserLeague;
  leagues: League[];
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user, setUser } = useUserStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { toast } = useToast();

  const handleClaimLeague = async (leagueId: number) => {
    if (!user) return;

    const claimed = await claimLeague(user.id, leagueId);
    if (claimed) {
      const updatedUser = await getUserData(user.id);
      setUser(updatedUser);
    } else {
      toast({
        title: 'Oops!',
        description: 'League requirements not met',
      });
    }
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat text-white border-none h-full">
        <div className="mx-auto font-gumdrop uppercase text-center pt-8">
          <p className="text-[20px] text-[#0ea2b5]">Your current league</p>
          <p className="text-[48px] -mt-2">{userLeague.title}</p>
          <Button variant={'silver'} onClick={() => setDrawerOpen(true)}>
            How it works
          </Button>
        </div>
        <div className="flex flex-col gap-2 px-8 overflow-y-auto max-h-[400px] mt-3">
          {leagues.map((league, index) => (
            <LeagueItem
              key={index}
              league={league}
              onComplete={handleClaimLeague}
              currentLeague={league.id === userLeague.id}
            />
          ))}
        </div>

        <X className="absolute top-4 right-4" onClick={() => setOpen(false)} />
        <RewardsDrawer open={drawerOpen} setOpen={setDrawerOpen} />
      </DrawerContent>
    </Drawer>
  );
}
