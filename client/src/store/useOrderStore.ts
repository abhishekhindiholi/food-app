import type { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";

const API_END_POINT: string = "http://localhost:8000/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            const token = useUserStore.getState().token;
            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json',
                    token: token
                }
            });
            window.location.href = response.data.session.url;
            set({ loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const token = useUserStore.getState().token;
            const response = await axios.get(`${API_END_POINT}/`, {
                headers: {
                    token: token
                }
            });

            set({loading:false, orders:response.data.orders});
        } catch (error) {
            set({loading:false});
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))