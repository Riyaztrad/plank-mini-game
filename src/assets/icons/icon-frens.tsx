import Image from 'next/image';
import FriendsIcon from './Friends.png';

const IconFrens = () => {
  return (
    <Image
      src={FriendsIcon}
      alt="Friends Icon"
      width={50}
      height={50}
    />
  );
};

export default IconFrens;



