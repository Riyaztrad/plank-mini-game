import Image from 'next/image';
import HomeIcon from './Home.png';

const IconHome = () => {
  return <Image src={HomeIcon} alt="Home Icon" width={30} height={30} />;
};

export default IconHome;
