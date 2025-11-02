// store/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/types";

export const useUser = create(
  persist<{
    user: User | null;
    setUser: (newUser: User) => void;
    clearUser: () => void;
  }>(
    (set) => ({
      user: null,
      setUser: (newUser: User) => set({ user: newUser }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // اسم المفتاح في localStorage
    }
  )
);
