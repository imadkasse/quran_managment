// import { User } from "@/types/user";
import { User } from "@/types/types";
import { create } from "zustand";
export const useUser = create<{
  user: User | null;
  setUser: (newUser: User) => void;
}>((set) => ({
  user: null,
  setUser: (newUser: User) => {
    set(() => ({ user: newUser }));
  },
}));
