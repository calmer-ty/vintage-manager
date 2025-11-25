"use client";

import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";
interface IGradeModalContextType {
  isOpenGrade: boolean;
  setIsOpenGrade: React.Dispatch<React.SetStateAction<boolean>>;
  openGrade: () => void;
  closeGrade: () => void;
}
const GradeModalContext = createContext<IGradeModalContextType>({
  isOpenGrade: false,
  setIsOpenGrade: () => {},
  openGrade: () => {},
  closeGrade: () => {},
});
export const GradeModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenGrade, setIsOpenGrade] = useState(false);
  const openGrade = () => setIsOpenGrade(true);
  const closeGrade = () => setIsOpenGrade(false);

  return <GradeModalContext.Provider value={{ isOpenGrade, setIsOpenGrade, openGrade, closeGrade }}>{children}</GradeModalContext.Provider>;
};

// 커스텀 훅으로 간편하게 사용 가능
export const useGradeDialog = () => useContext(GradeModalContext);
