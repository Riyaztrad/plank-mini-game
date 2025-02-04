import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { setUserWalletAddress } from '../../services/user.service';
import { useUserStore } from '../../store/userStore';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

export default function ConnectWalletDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { user, setUser } = useUserStore();
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnectWallet = async () => {
    if (user && walletAddress) {
      await setUserWalletAddress(user.id, walletAddress);
      setUser({
        ...user,
        walletAddress,
      });
      setOpen(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-black border-none text-white font-inter">
        <DrawerHeader className="text-[24px] font-gumdrop mx-4 leading-none">
          Enter Your Binance Smart Chain Wallet Address
        </DrawerHeader>
        <div className="p-5">
          <div className="font-bold text-center text-[12px] mx-auto">
            Enter a wallet address to receive your ESX Tokens
          </div>

          <input
            type="text"
            placeholder="Wallet Address"
            className="w-full text-black py-4 px-5 bg-white shadow-primary-custom text-[14px] rounded-lg mt-8 outline-none border-none"
            onChange={(e) => setWalletAddress(e.target.value)}
          />

          <Button variant={'green'} onClick={handleConnectWallet} className="mt-4 w-full">
            Save wallet
          </Button>

          <X className="absolute top-3 right-3 cursor-pointer" onClick={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
