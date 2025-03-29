import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

import type { IncomeItemData } from "@/commons/types";

interface IncomeItemTableProps {
  incomeItemArray: IncomeItemData[];
}

const columns: GridColDef[] = [
  { field: "createdAt", headerName: "시트 생성 시간", width: 200 },
  { field: "brandName", headerName: "브랜드명", width: 200 },
  { field: "itemName", headerName: "제품명", width: 200 },
  { field: "JPY", headerName: "매입 가격(엔화)", width: 130 },
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

export default function IncomeItemTable({ incomeItemArray }: IncomeItemTableProps) {
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid rows={incomeItemArray} columns={columns} initialState={{ pagination: { paginationModel } }} pageSizeOptions={[5, 10]} checkboxSelection sx={{ border: 0 }} />
    </Paper>
  );
}
