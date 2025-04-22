import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import type { IIncomeItemData } from "@/commons/types";

import { Box } from "@mui/material";
import { useMemo } from "react";

interface IncomeItemTableProps {
  incomeItemArray: IIncomeItemData[];
  setSelectionItem: React.Dispatch<React.SetStateAction<string[]>>;
}

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "시트 생성 시간", width: 200 },
  { field: "brandName", headerName: "브랜드명", width: 200 },
  { field: "itemName", headerName: "제품명", width: 200 },
  { field: "price", headerName: "매입 가격(원)", width: 130 },
  // { field: "lastName", headerName: "Last name", width: 130 },
  // {
  //   field: "age",
  //   headerName: "Age",
  //   type: "number",
  //   width: 90,
  // },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
  // },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ incomeItemArray, setSelectionItem }: IncomeItemTableProps) {
  // 선택한 행 id들 가져오기
  const handleSelectionChange = (selectionItem: any) => {
    setSelectionItem(selectionItem);
  };

  // 해석 필요!
  const priceSum = useMemo(() => {
    // reduce()는 배열의 모든 요소를 하나의 값으로 줄이기 위해 사용하는 함수 >> sum은 누적된 값, el은 배열의 각 요소
    return incomeItemArray.reduce((total, el) => {
      // item.price를 숫자로 변환
      const price = Number(el.price);

      // 숫자가 아니면 무시하고 그대로 리턴
      if (isNaN(price)) return total;

      // 숫자라면 total에 더해줌
      return total + price;
    }, 0);
  }, [incomeItemArray]);

  return (
    <Paper sx={{ height: 400, width: "100%", position: "relative" }}>
      <DataGrid
        rows={incomeItemArray}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowSelectionModelChange={handleSelectionChange}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem", position: "absolute", bottom: "0.8rem", left: "11rem" }}>
        <span>
          총 매입한 가격: <strong>{priceSum}</strong> 엔
        </span>
        <span>
          총 매물 개수: <strong>{incomeItemArray.length}</strong> 개
        </span>
      </Box>
    </Paper>
  );
}
