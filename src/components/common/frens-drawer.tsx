import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { Copy, CopyCheck, X } from 'lucide-react';
import { Button } from '../ui/button';
import Image from 'next/image';
import AlienImage from '../../assets/images/alien.png';
import { useUserStore } from '../../store/userStore';
import { useState } from 'react';
import { createRawLink } from '../../lib/utils';
import { DIRECT_REFERRER_POINTS_REWARD } from '../../data/constants';

export default function FrensDrawer({
  open,
  setOpen,
  inviteLink,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  inviteLink: string;
}) {
  const { user } = useUserStore();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const referralCode = user?.code || '';
    navigator.clipboard.writeText(createRawLink(referralCode));
    setCopied(true);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[580px] border-none rounded-t-3xl bg-[url('/bg-frens.png')] bg-cover bg-center bg-no-repeat text-white px-4">
        <DrawerHeader className="text-[44px] text-center font-gumdrop mx-8 leading-none">
          How it works
        </DrawerHeader>
        <div className="mt-auto">
          <div className="p-4 flex items-center justify-center gap-4 rounded-xl bg-[#06334133] backdrop-blur-lg">
            <div className="">
              <p className="font-gumdrop text-[20px]">
                +{DIRECT_REFERRER_POINTS_REWARD} Coins for invite
              </p>
              <p className="text-[12px]" style={{ textShadow: '0px 4px 4px #00000040' }}>
                You&apos;ll get {DIRECT_REFERRER_POINTS_REWARD} coins for every invite. Every boss
                killed by your referral will earn you huge prizes:
              </p>
            </div>
            <Image src={AlienImage} alt="alien" width={120} height={120} className="w-20 h-auto" />
          </div>
          <p className="text-[20px] leading-none mx-16 text-center my-4 font-gumdrop">
            Earn up to 5 time bonuses daily by inviting frens
          </p>
          <p
            className="text-[12px] mx-16 text-center mb-6"
            style={{ textShadow: '0px 4px 4px #00000040' }}>
            You can earn additional coins when your frens also share with their frens.
          </p>

          <div className="flex items-center gap-4 justify-center my-4">
            <a href={inviteLink} className="w-full">
              <Button variant={'green'} className="w-full">
                Invite Frens
              </Button>
            </a>
            <button
              className="p-4 bg-[#063341] rounded-xl border-2 border-[#0D4C60]"
              onClick={handleCopyLink}>
              {copied ? <CopyCheck /> : <Copy />}
            </button>
          </div>

          <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
