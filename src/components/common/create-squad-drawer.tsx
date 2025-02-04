import { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader } from '../../components/ui/drawer';
import { createSquad } from '../../services/squad.service';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

export default function CreateSquadDrawer({
  open,
  setOpen,
  onCreateSquad,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCreateSquad: () => void;
}) {
  const [squadHandle, setSquadHandle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateSquad = async () => {
    if (!squadHandle || !squadHandle.startsWith('@')) {
      setErrorMessage('Squad handle invalid, must start with @');
      return;
    }

    const res = await createSquad(squadHandle);
    if (!res) {
      setErrorMessage('Community not found. Try again');
    } else {
      setErrorMessage('');
      onCreateSquad();
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="bg-black border-none text-white font-inter">
        <DrawerHeader className="text-[24px] font-gumdrop">Create a Squad</DrawerHeader>
        <div className="px-5 pb-5">
          <div className="w-[270px] font-bold text-center mx-auto text-[12px]">
            Enter the public group or channel link below to automatically create or join a squad
          </div>

          <input
            type="text"
            placeholder="@communityname"
            className="w-full text-black py-4 px-5 bg-white shadow-primary-custom text-[14px] rounded-lg mt-8 outline-none border-none"
            onChange={(e) => setSquadHandle(e.target.value)}
          />

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <Button variant={'green'} onClick={handleCreateSquad} className="w-full mt-3">
            Create Squad
          </Button>
        </div>
        <X className="absolute top-5 right-5 cursor-pointer" onClick={() => setOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
