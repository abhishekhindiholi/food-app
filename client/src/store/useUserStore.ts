import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { type LoginInputState, type SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";
import { useCartStore } from "./useCartStore";

interface User {
  fullName: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
}

interface UserStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: unknown) => Promise<void>;
}

const API_END_POINT = "http://localhost:8000/api/v1/user";
axios.defaults.withCredentials = true;


export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,
      signup: async (input: SignupInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      login: async (input: LoginInputState) => {
        try {
          set({ loading: true });
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
            });
            useCartStore.getState().clearCart();
          }
        } catch (error: unknown) {
          if (error instanceof Error && 'response' in error) {
            toast.error((error as any).response.data.message);
          }
          set({ loading: false });
        }
      },
      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const token = get().token;
          const response = await axios.get(`${API_END_POINT}/check-auth`, {
            headers: {
              token: token,
            },
          });
          if (response.data.success) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          }
        } catch (error) {
          set({ isAuthenticated: false, isCheckingAuth: false });
        }
      },
      logout: () => {
        toast.success("Logged out successfully");
        set({ user: null, token: null, isAuthenticated: false });
        useCartStore.getState().clearCart();
      },
      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },
      updateProfile: async (input: unknown) => {
        try {
          const token = get().token;
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
                token: token,
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
