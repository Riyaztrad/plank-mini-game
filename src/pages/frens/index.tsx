import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { createRawLink, createShareLink, getUserFromTelegram } from '../../lib/utils';
import { getFriends } from '../../services/user.service';
import { Friend, User } from '../../types/user.interface';
import { useUserStore } from '../../store/userStore';
import Navbar from '../../components/common/navbar';
import { Button } from '../../components/ui/button';
import FrenItem from '../../components/common/fren-item';
import Image from 'next/image';
import TelescopeImage from '../../assets/images/telescope.png';
import AlienImage from '../../assets/images/alien.png';
import { Copy, CopyCheck } from 'lucide-react';
import FrensDrawer from '../../components/common/frens-drawer';
import { DIRECT_REFERRER_POINTS_REWARD } from '../../data/constants';

const Frens: NextPage = () => {
  const { user } = useUserStore();

  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    getReferredUsersFromApi();
  }, []);

  useEffect(() => {
    if (user) {
      configureInviteLink(user);
    }
  }, [user]);

  const getReferredUsersFromApi = async () => {
    const user = getUserFromTelegram();
    const res = await getFriends(user.id.toString());
    setFriends(res);
  };

  const handleCopyLink = () => {
    const referralCode = user?.code || '';
    navigator.clipboard.writeText(createRawLink(referralCode));
    setCopied(true);
  };

  const configureInviteLink = (user: User) => {
    const referralCode = user?.code || '';
    const link = createShareLink(referralCode);
    setInviteLink(link);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-[url('/frens-banner.png')] bg-cover bg-center bg-no-repeat flex flex-col px-5 overflow-y-auto">
      <div className="flex flex-col w-full">
        <div className="mx-auto font-gumdrop uppercase text-center pt-8">
          <p className="text-[20px] text-[#0ea2b5]">your frens</p>
          <p className="text-[48px] -mt-2">{friends.length} frens</p>
          <Button variant={'silver'} onClick={() => setDrawerOpen(true)}>
            How it works
          </Button>
        </div>
        {friends.length > 0 ? (
          <div className="space-y-2 mt-4 overflow-y-auto h-[300px]">
            {friends.map((user, index) => (
              <FrenItem user={user} index={index} key={index} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <div className="p-4 rounded-xl bg-[#063341] border-2 border-[#0D4C60] flex items-center justify-center gap-4">
              <div className="">
                <p className="font-gumdrop text-[20px]">
                  +{DIRECT_REFERRER_POINTS_REWARD} Coins for invite
                </p>
                <p className="text-[12px]">
                  You&apos;ll get {DIRECT_REFERRER_POINTS_REWARD} coins for every invite. Every boss
                  killed by your referral will earn you huge prizes:
                </p>
              </div>
              <Image
                src={AlienImage}
                alt="alien"
                width={120}
                height={120}
                className="w-20 h-auto"
              />
            </div>
            <div className="flex flex-col items-center gap-2 mt-6 text-center">
              <Image
                src={TelescopeImage}
                alt="telescope"
                width={120}
                height={120}
                className="w-20 h-auto"
              />
              <p className="font-gumdrop text-[24px]">no frens</p>
              <p className="text-[12px]">
                We haven&apos;t found any users that joined the game with your invite code. Invite
                friends to receive bonuses!
              </p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 justify-center mt-4">
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
      </div>

      <div className="mt-auto">
        <Navbar />
      </div>

      <FrensDrawer open={drawerOpen} setOpen={setDrawerOpen} inviteLink={inviteLink} />
    </div>
  );
};

export default Frens;
