import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import HeartImage from '../../assets/images/boosts/heart.png';
import CoinImage from '../../assets/images/coin.png';
import { useUserStore } from '../../store/userStore';
import { DailyRewards } from '../../types/reward.interface';

export default function DailyCheckInDrawer({
  open,
  setOpen,
  rewards,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  rewards: DailyRewards | undefined;
}) {
  const { user } = useUserStore();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[580px] border-none rounded-t-3xl bg-[url('/bg-daily.png')] bg-cover bg-top bg-no-repeat text-white px-4">
        <div className="mt-auto">
          <DrawerHeader className="text-[44px] text-center font-gumdrop mx-12 leading-none">
            {rewards?.consecutiveDays} day check-in
          </DrawerHeader>
          <div className="mt-20 flex justify-center gap-4">
            <div className="flex flex-col items-center justify-center h-[155px] w-[110px] border-2 border-white rounded-xl bg-white/10 font-gumdrop shadow-[0px_4px_0px_0px_#FFFFFF] backdrop-blur-lg">
              <Image
                src={HeartImage}
                alt="heart"
                width={120}
                height={120}
                className="w-12 h-auto mb-3"
              />
              <p className="text-[20px]">{rewards?.playCoins}</p>
              <p className="text-[12px] text-[#0D4C60]">extra play</p>
            </div>
            <div className="flex flex-col items-center justify-center h-[155px] w-[110px] border-2 border-white rounded-xl bg-white/10 font-gumdrop shadow-[0px_4px_0px_0px_#FFFFFF] backdrop-blur-lg">
              <Image
                src={CoinImage}
                alt="coin"
                width={120}
                height={120}
                className="w-12 h-auto mb-3"
              />
              <p className="text-[20px]">{rewards?.points}</p>
              <p className="text-[12px] text-[#0D4C60]">points</p>
            </div>
          </div>

          <Button variant="green" className="w-full my-6" onClick={() => setOpen(false)}>
            Claim rewards
          </Button>

          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
