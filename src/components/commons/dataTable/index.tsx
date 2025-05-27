import { useMemo } from "react";

import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import type { IIncomeItemData } from "@/commons/types";

interface IncomeItemTableProps {
  incomeItemArray: IIncomeItemData[];
  currencyUnit: string;
  setSelectionItem: React.Dispatch<React.SetStateAction<string[]>>;
}

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({ incomeItemArray, currencyUnit, setSelectionItem }: IncomeItemTableProps) {
  const columns: GridColDef[] = [
    { field: "createdAt", headerName: "시트 생성 시간", width: 200 },
    { field: "itemType", headerName: "타입", width: 120 },
    { field: "brandName", headerName: "브랜드명", width: 200 },
    { field: "itemName", headerName: "제품명", width: 200 },
    {
      field: "price",
      headerName: "매입 가격(단위)",
      width: 130,
      valueFormatter: (params: number) => {
        const value = Math.floor(params); // 버림
        return `${value.toLocaleString()} ${currencyUnit}`;
      },
    },
    {
      field: "priceKRW",
      headerName: "매입 가격(원)",
      width: 130,
      valueFormatter: (params: number) => {
        const value = Math.floor(params); // 버림
        return `${value.toLocaleString()} 원`;
      },
    },
  ];

  // 선택한 행 id들 가져오기
  const handleSelectionChange = (selectionItem: GridRowSelectionModel) => {
    setSelectionItem(selectionItem as string[]);
  };

  // 해석 필요!
  const priceSum = useMemo(() => {
    // reduce()는 배열의 모든 요소를 하나의 값으로 줄이기 위해 사용하는 함수 >> sum은 누적된 값, el은 배열의 각 요소
    return incomeItemArray.reduce((sum, el) => {
      // item.price를 숫자로 변환
      const priceKRW = Number(el.priceKRW);

      // 숫자가 아니면 무시하고 그대로 리턴
      if (isNaN(priceKRW)) return sum;

      // 숫자라면 sum에 더해줌
      return sum + priceKRW;
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
          총 매입한 가격: <strong>{Math.floor(priceSum).toLocaleString()}</strong> 원
        </span>
        <span>
          총 매물 개수: <strong>{incomeItemArray.length}</strong> 개
        </span>
      </Box>
    </Paper>
  );
}
