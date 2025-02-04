import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import CoinImage from '../../assets/images/coin.png';
import { Boost } from '../../types/boost.interface';
import { RewardBoost } from './reward-boost';

export default function TaskDrawer({
  open,
  setOpen,
  points,
  boosts,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  points: number;
  boosts: Boost[];
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[460px] border-none rounded-t-3xl bg-[url('/bg-task.png')] bg-cover bg-top bg-no-repeat text-white px-4">
        <div className="mt-auto">
          <DrawerHeader className="text-[44px] text-center font-gumdrop mx-12 leading-none">
            Task completed
          </DrawerHeader>
          <p className="text-center text-[12px]">
            You have been Rewarded with some Extra Upgrades!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            {boosts.map((boost) => (
              <RewardBoost key={boost.id} boost={boost} />
            ))}
            <div className="flex flex-col items-center justify-center h-[155px] w-[110px] border-2 border-white rounded-xl bg-white/10 font-gumdrop shadow-[0px_4px_0px_0px_#FFFFFF] backdrop-blur-lg">
              <Image
                src={CoinImage}
                alt="coin"
                width={120}
                height={120}
                className="w-12 h-auto mb-3"
              />
              <p className="text-[20px]">{points}</p>
              <p className="text-[12px] text-[#0D4C60]">points</p>
            </div>
          </div>

          <Button variant="green" className="w-full my-6" onClick={() => setOpen(false)}>
            Done
          </Button>

          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
