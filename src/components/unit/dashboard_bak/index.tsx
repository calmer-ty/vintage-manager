import { motion } from "framer-motion";

import { useDateSelectStore } from "@/store/useDateSelectStore";
import { useProducts } from "@/hooks/useProducts";
import { usePackages } from "@/hooks/usePackages";

import YearMonthSelect from "@/components/commons/YearMonthSelect";
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2, // 큰 덩어리들 순서대로 등장
      delayChildren: 0.3,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashBoardUI() {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelectStore();
  const { packages } = usePackages({ selectedYear, selectedMonth });
  const { products } = useProducts({ selectedYear, selectedMonth });

  return (
    <motion.article className="px-6 py-6 sm:px-10" variants={containerVariants} initial="hidden" animate="show">
      <motion.header variants={sectionVariants} className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
      </motion.header>
      <motion.section variants={sectionVariants}>
        <DashboardStatus packages={packages} products={products} />
      </motion.section>

      <motion.section variants={sectionVariants}>
        <DashboardChart selectedYear={selectedYear} selectedMonth={selectedMonth} products={products} />
      </motion.section>
    </motion.article>
  );
}
