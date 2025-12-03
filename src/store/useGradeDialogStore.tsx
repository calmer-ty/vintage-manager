import { create } from "zustand";

interface IGradeDialogState {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useGradeDialogStore = create<IGradeDialogState>((set) => ({
  isOpen: false,
  setIsOpen: (open) => set({ isOpen: open }),
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
