// 훅
import { useAuth } from "@/contexts/authContext";

// 외부 요소
import { FcGoogle } from "react-icons/fc";
import { FlagIcon } from "react-flag-kit";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StartedIntro() {
  const { handleLogin } = useAuth();

  return (
    <section className="relative py-40 text-center bg-stone-800 text-white overflow-hidden">
      {/* 배경 장식 이미지 */}
      <img
        src="/images/started_2.png"
        className="absolute left-10 top-8 w-170 opacity-10 pointer-events-none
          hidden lg:block"
        alt="왼쪽 이미지"
      />
      <img
        src="/images/started.png"
        className="absolute right-12 bottom-6 w-90 opacity-40 pointer-events-none
          hidden lg:block"
        alt="오른쪽 이미지"
      />

      <motion.div className="relative z-10 max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-14">
          <h2 className="text-5xl font-bold mb-16">빈티지 노트</h2>
          <p className="text-xl mb-10">다양한 국가에서 사입한 상품들의 예상 수익을 간편하게 확인하세요.</p>
          <p className="text-lg text-gray-300">상품 관리와 대시보드로 매입가·판매가·재고를 정리하고 전체 흐름을 쉽게 파악할 수 있습니다.</p>
        </div>

        {/* 지원 국가 */}
        <div className="mb-10">
          <h3 className="text-lg font-medium mb-6">지원 가능 국가</h3>
          <ul className="flex justify-center gap-4">
            <li className="flex flex-col items-center gap-1 w-14">
              <FlagIcon code="US" size={32} />
              <span className="text-sm text-gray-300">미국</span>
            </li>
            <li className="flex flex-col items-center gap-1 w-14">
              <FlagIcon code="JP" size={32} />
              <span className="text-sm text-gray-300">일본</span>
            </li>
            <li className="flex flex-col items-center gap-1 w-14">
              <FlagIcon code="KR" size={32} />
              <span className="text-sm text-gray-300">대한민국</span>
            </li>
          </ul>
          {/* <p className="mt-2 text-sm text-gray-400">그 외 모든 국가 지원</p> */}
        </div>

        {/* 로그인 버튼 */}
        <div className="flex justify-center gap-4">
          <Button variant="default" className="flex items-center justify-center gap-2" onClick={handleLogin}>
            <FcGoogle size={20} />
            구글 로그인 하고 시작하기
          </Button>
          <Button asChild variant="default" className="flex items-center justify-center gap-2">
            <a href="#points">
              <Settings size={24} />
              기능 보기
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
