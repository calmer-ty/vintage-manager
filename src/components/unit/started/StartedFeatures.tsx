// 훅
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

// 외부 요소
import { motion } from "framer-motion";
import { Calendar, Globe, Monitor, Package } from "lucide-react";

const points = [
  {
    title: "월별 간편조회",
    desc: "월 단위로 매입/판매/재고/수익을 한눈에",
    icon: <Calendar size={24} />,
  },
  {
    title: "환율 적용",
    desc: "해외 통화를 원화로 변환해 매입·판매·수익 확인 가능",
    icon: <Globe size={24} />,
  },
  {
    title: "상품 관리",
    desc: "등록부터 판매까지 체계적 관리",
    icon: <Package size={24} />,
  },
  {
    title: "반응형 디자인",
    desc: "다양한 환경에서 최적화",
    icon: <Monitor size={24} />,
  },
];

export default function StartedFeatures() {
  const MotionCard = motion(Card);

  return (
    <section id="points" className="relative px-10 sm:px-18 py-20 sm:py-30 xl:py-52 text-center bg-stone-50">
      <motion.h3
        className=" text-3xl font-bold
            mb-12 sm:mb-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <strong className="text-stone-700 text-4xl">빈티지 노트</strong>의 주요 기능
      </motion.h3>
      <div
        className="grid gap-10
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      >
        {points.map((el, idx) => (
          <MotionCard
            key={`${el.title}_${idx}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
            className="w-full py-4 lg:py-6 
            group transition-shadow duration-300 ease-in-out hover:shadow-xl"
          >
            <CardContent className="flex flex-col items-center">
              <div className="mb-6 p-2 rounded-lg transition-bg duration-300 ease-in-out bg-gray-100 group-hover:bg-gray-200 shadow-md">
                {el.icon}
              </div>
              <CardTitle className="mb-4 text-xl">{el.title}</CardTitle>
              <CardDescription className="text-md">{el.desc}</CardDescription>
            </CardContent>
          </MotionCard>
        ))}
      </div>
    </section>
  );
}
