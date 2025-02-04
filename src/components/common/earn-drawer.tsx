import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export default function EarnDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[580px] border-none rounded-t-3xl bg-[url('/bg-earn.png')] bg-cover bg-center bg-no-repeat text-white px-4">
        <DrawerHeader className="text-[44px] text-center font-gumdrop mx-8 leading-none">
          Earn while you play
        </DrawerHeader>
        <div className="mt-auto">
          <p className="text-[12px] mx-16 text-center mb-3">
            Complete tasks to earn coins and unlock exclusive bonuses.
          </p>
          <p className="text-[12px] mx-16 text-center mb-6">
            Claim your share of the $ESX token reward pool and reap the rewards!
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
