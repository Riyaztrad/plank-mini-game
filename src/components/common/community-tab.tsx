import React from 'react';
import { Squad } from '../../types/squad.interface';
import { useUserStore } from '../../store/userStore';
import { Button } from '../ui/button';
import SquadItem from './squad-item';

type Props = {
  communities: Squad[];
  onCreateSquad: () => void;
};

const CommunityTab = ({ communities, onCreateSquad }: Props) => {
  const { user } = useUserStore();
  const handleJoinSquad = () => {};

  return (
    <div className="grow flex flex-col mt-3 gap-3">
      <Button variant={'silver'} onClick={onCreateSquad}>
        Create a squad
      </Button>

      <div className="grow overflow-auto flex flex-col gap-4">
        {communities.map((community, index) => (
          <SquadItem squad={community} key={index} onJoin={handleJoinSquad} />
        ))}
      </div>
    </div>
  );
};

export default CommunityTab;
