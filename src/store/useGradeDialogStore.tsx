import { create } from "zustand";

interface IGradeDialogState {
  isOpenGrade: boolean;
  openGrade: () => void;
  closeGrade: () => void;
  setIsOpenGrade: (open: boolean) => void;
}

export const useGradeDialogStore = create<IGradeDialogState>((set) => ({
  isOpenGrade: false,
  setIsOpenGrade: (open) => set({ isOpenGrade: open }),
  openGrade: () => set({ isOpenGrade: true }),
  closeGrade: () => set({ isOpenGrade: false }),
}));
