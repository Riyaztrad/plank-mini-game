import { axiosDefault } from '../lib/axios';
import { ShopItem } from '../types/boost.interface';

export async function getShopItems(): Promise<ShopItem[]> {
  try {
    const response = await axiosDefault.get(`/api/shop/items`);
    return response.data.items;
  } catch (err) {
    return [];
  }
}

export async function getPurchaseLink(
  shopItemId: number,
  userId: string
): Promise<{ invoiceLink: string; purchaseId: string }> {
  try {
    const res = await axiosDefault.post(`/api/shop/link`, { shopItemId, userId });
    return res.data;
  } catch {
    return {
      invoiceLink: '',
      purchaseId: '',
    };
  }
}

export async function createPurchase(
  shopItemId: number,
  userId: string
): Promise<{ invoiceLink: string; purchaseId: string }> {
  try {
    const res = await axiosDefault.post(`/api/shop/ton`, { shopItemId, userId });
    return res.data;
  } catch {
    return {
      invoiceLink: '',
      purchaseId: '',
    };
  }
}

export async function pollAndConfirmPurchase(userId: string, purchaseId: string): Promise<boolean> {
  try {
    const res = await axiosDefault.post(`/api/shop/purchase`, { userId, purchaseId });
    return res.data.hasConfirmed;
  } catch {
    return false;
  }
}

export async function confirmTonPurchase(
  userId: string,
  purchaseId: string,
  boc: string
): Promise<boolean> {
  try {
    await axiosDefault.post(`/api/shop/confirm`, { userId, purchaseId, boc });
    return true;
  } catch {
    return false;
  }
}
