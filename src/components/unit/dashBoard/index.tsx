import { motion } from "framer-motion";

import { useDateSelect } from "@/contexts/dateSelectContext";
import { useProducts } from "@/hooks/useProducts";
import { usePackages } from "@/hooks/usePackages";

import YearMonthSelect from "@/components/commons/YearMonthSelect";
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

import type { IUserID } from "@/types";

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

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelect();
  const { packages } = usePackages({ uid, selectedYear, selectedMonth });
  const { products } = useProducts({ uid, selectedYear, selectedMonth });

  return (
    <motion.article className="px-6 py-6 sm:px-10" variants={containerVariants} initial="hidden" animate="show">
      <motion.header variants={sectionVariants} className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </motion.header>
      <motion.div variants={sectionVariants}>
        <DashboardStatus products={products} packages={packages} />
      </motion.div>

      <motion.div variants={sectionVariants}>
        <DashboardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
      </motion.div>
    </motion.article>
  );
}
