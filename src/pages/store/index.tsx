import type { NextPage } from 'next';
import { useUserStore } from '../../store/userStore';
import Navbar from '../../components/common/navbar';
import { UserBoost } from '../../components/common/user-boost';
import { useEffect, useRef, useState } from 'react';
import { StoreItem } from '../../components/common/store-item';
import { StorePack } from '../../components/common/store-pack';
import PurchaseItemDrawer from '../../components/common/purchase-item-drawer';
import { ShopItem } from '../../types/boost.interface';
import {
  getPurchaseLink,
  getShopItems,
  confirmTonPurchase,
  pollAndConfirmPurchase,
  createPurchase,
} from '../../services/store.service';
import { getUserData } from '../../services/user.service';
import { TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

const Store: NextPage = () => {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [purchaseDrawerOpen, setPurchaseDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItem>();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [purchaseId, setPurchaseId] = useState<string>(''); // Track the purchase ID
  const intervalRef = useRef<any>(null); // Store the interval ID here
  const purchaseType = useRef<string>(''); // Store the purchase type
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();

  const handleSelectItem = (item: ShopItem) => {
    setSelectedItem(item);
    setPurchaseDrawerOpen(true);
  };

  const getShopItemsFromApi = async () => {
    const res = await getShopItems();
    setShopItems(res);
  };

  // Effect to start polling when purchaseId is set
  useEffect(() => {
    if (purchaseId !== '') {
      intervalRef.current = setInterval(() => {
        confirmPurchaseIfNeeded();
      }, 5000);
    }

    return () => clearInterval(intervalRef.current); // Cleanup on unmount or when purchaseId changes
  }, [purchaseId]);

  useEffect(() => {
    getShopItemsFromApi();
  }, []);

  const handlePurchase = async (mode: string) => {
    if (!selectedItem || !user) return;

    purchaseType.current = mode;

    if (mode === 'stars') {
      const { invoiceLink, purchaseId } = await getPurchaseLink(selectedItem.id, user.id);
      setPurchaseId(purchaseId); // Set the purchaseId to start polling after
      try {
        (window as any).Telegram.WebApp.openInvoice(invoiceLink, (res: any) => {
          setPurchaseDrawerOpen(false);
          // handle response
          console.log('Invoice response:', res);
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      if (!userFriendlyAddress) {
        tonConnectUI.openModal();
      }

      const { purchaseId } = await createPurchase(selectedItem.id, user.id);
      setPurchaseId(purchaseId); // Set the purchaseId to start polling after

      const address = 'UQA5zSTrYfSI2KPHTA5Yqzda0_5G3vaisArFR7MnnVelUZPf';
      if (!address) return;

      const txData = {
        messages: [{ address, amount: selectedItem.tonPrice.toString() }],
        validUntil: Math.floor(new Date().getTime() / 1000) + 360,
      };

      const result = await tonConnectUI.sendTransaction(txData);
      await confirmTonPurchase(user.id, purchaseId, result.boc);

      clearInterval(intervalRef.current);

      const updatedUser = await getUserData(user.id);
      setUser(updatedUser);
      router.push(`/purchase-success?amount=${selectedItem.tonPrice / 1e9}`);
    }
  };

  // Function to confirm purchase polling
  const confirmPurchaseIfNeeded = async () => {
    if (!user || purchaseId === '' || purchaseType.current !== 'stars') return;

    const hasConfirmed = await pollAndConfirmPurchase(user.id, purchaseId);
    console.log('Has confirmed:', hasConfirmed);
    if (hasConfirmed) {
      clearInterval(intervalRef.current); // Stop polling when purchase is confirmed
      setPurchaseId(''); // Reset purchaseId after confirmation
      const updatedUser = await getUserData(user.id);
      setUser(updatedUser);
    }
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-screen bg-gradient-to-b from-[#0c1f24] to-[#02141a] flex flex-col p-5 overflow-y-auto">
      <div>
        <p className="text-center text-[15px] font-gumdrop">Inventory</p>
        <div className="flex justify-center gap-2 items-center mt-1 mb-2 px-2">
          {user?.boosts &&
            user?.boosts.map((boost, index) => <UserBoost key={index} boost={boost} />)}
        </div>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        <p className="text-center text-[15px] font-gumdrop mb-2">Store</p>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {shopItems
            .filter((item) => item.type === 'item')
            .map((item, index) => (
              <StoreItem
                key={index}
                item={item}
                blocked={Boolean((user?.league?.id || 0) < item.requiredLeague || item.blocked)}
                onClick={() => handleSelectItem(item)}
              />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-3 mb-3">
          {shopItems
            .filter((item) => item.type === 'pack')
            .map((item, index) => (
              <StorePack
                key={index}
                item={item}
                blocked={Boolean((user?.league?.id || 0) < item.requiredLeague || item.blocked)}
                onClick={() => handleSelectItem(item)}
              />
            ))}
        </div>
      </div>

      <div className="mt-auto">
        <Navbar />
      </div>

      {selectedItem && (
        <PurchaseItemDrawer
          item={selectedItem}
          open={purchaseDrawerOpen}
          setOpen={setPurchaseDrawerOpen}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default Store;
