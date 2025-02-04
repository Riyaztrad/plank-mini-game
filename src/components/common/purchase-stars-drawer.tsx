import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';

export default function PurchaseStarsDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[580px] border-none rounded-t-3xl bg-[url('/bg-stars.png')] bg-cover bg-top bg-no-repeat text-white px-4">
        <div className="mt-auto">
          <DrawerHeader className="text-[44px] text-center font-gumdrop mx-4 leading-none">
            Purchase stars
          </DrawerHeader>
          <p className="text-[12px] mx-10 text-center">
            Level up with Telegram Stars! ⭐ Find yourself rocketing through the leagues!{' '}
          </p>
          <Link href="https://fragment.com/stars" target="_blank">
            <Button variant="green" className="w-full my-6">
              Get stars
            </Button>
          </Link>
          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
