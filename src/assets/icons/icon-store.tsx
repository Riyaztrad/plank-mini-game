import Image from 'next/image';
import StoreIcon from './Store.png';

const IconStore = () => {
  return (
    <Image
      src={StoreIcon}
      alt="Store Icon"
      width={35}
      height={30}
    />
  );
};

export default IconStore;



