import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export default function RewardsDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[580px] border-none rounded-t-3xl bg-[url('/bg-rewards.png')] bg-cover bg-top bg-no-repeat text-white px-4">
        <DrawerHeader className="text-[44px] text-center font-gumdrop mx-4 leading-none">
          Rewards
        </DrawerHeader>
        <div className="mt-auto">
          <p className="text-[12px] mx-10 text-center mb-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            Leagues are where the big scores shine! Crush the competition, climb to the top league,
            and claim your share of the token rewards at the end of the round!
          </p>

          <Button variant="green" className="w-full my-6" onClick={() => setOpen(false)}>
            Done
          </Button>

          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
