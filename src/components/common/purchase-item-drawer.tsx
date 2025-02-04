import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { ShopItem } from '../../types/boost.interface';
import StarImage from '../../assets/images/star.png';
import TonImage from '../../assets/images/ton.svg';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

export default function PurchaseItemDrawer({
  item,
  open,
  setOpen,
  onPurchase,
}: {
  item: ShopItem;
  open: boolean;
  setOpen: (open: boolean) => void;
  onPurchase: (mode: string) => void;
}) {
  const handleTonPurchase = () => {
    setOpen(false);
    onPurchase('ton');
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[360px] border-none rounded-t-3xl bg-[url('/bg-purchase.png')] bg-cover bg-top bg-no-repeat text-white px-4">
        <div className="mt-auto mx-auto text-center">
          <Image
            src={`/shop/${item.id}.svg`}
            alt="coin"
            width={400}
            height={400}
            className="w-32 h-auto mx-auto mb-3 floating"
          />
          <p className="text-[22px] capitalize mb-2">{item.text}</p>
          <p className="text-[14px] px-4">{item.description}</p>

          {/* {!userFriendlyAddress ? (
            <TonConnectButton className="mx-auto" />
          ) : ( */}
          <Button
            className="my-4 flex items-center justify-center gap-3 mx-auto bg-[#073340] rounded-full text-[15px] text-[#02a3b5] font-gumdrop"
            onClick={handleTonPurchase}>
            <span>Purchase for</span>
            <Image src={TonImage} alt="ton" width={120} height={120} className="w-6 h-auto" />
            <span>{item.tonPrice / 1e9}</span>
          </Button>
          {/* )} */}

          <Button
            variant="silver"
            className="w-full my-3 flex items-center justify-center gap-3"
            onClick={() => onPurchase('stars')}>
            <span>Purchase for</span>
            <Image src={StarImage} alt="star" width={120} height={120} className="w-6 h-auto" />
            <span>{item.price}</span>
          </Button>

          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
