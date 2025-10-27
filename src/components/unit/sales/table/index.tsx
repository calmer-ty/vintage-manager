// 라이브러리
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { getDisplayPrice } from "@/lib/price";

// 외부 요소
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PackageOpen } from "lucide-react";

// 내부 요소
import BasicTooltip from "@/components/commons/BasicTooltip";
import TableControl from "./TableControl";
import TableItemState from "./TableItemState";

import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ISalesProduct } from "@/types";
interface ISalesTableProps {
  data: ISalesProduct[];
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateTarget: Dispatch<SetStateAction<ISalesProduct | undefined>>;
  fetchProducts: () => Promise<void>;
  loading: boolean;
}

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "soldAt", label: "판매 일자" },
  { key: "name", label: "상품 정보" },
  { key: "sales", label: "판매 정보" },
];

export default function SalesTable({ data, setIsWriteOpen, setUpdateTarget, fetchProducts, loading }: ISalesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const dynamicColumns: ColumnDef<ISalesProduct>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      const value = row.getValue(key);

      if (value instanceof Timestamp) {
        // Timestamp일 때만 처리
        const timestamp = value as Timestamp;
        return <div>{timestamp.toDate().toLocaleDateString() ?? "-"}</div>;
      }
      if (value == null || value === "") {
        return <div>-</div>;
      }

      if (key === "name") {
        const n = row.original.name;
        return (
          <div>
            {n.product}({n.brand || "브랜드 없음"})
          </div>
        );
      }
      if (key === "sales") {
        const s = row.original.sales;
        const c = row.original.cost;
        return s.profit == null ? (
          <Card className="py-4 gap-2">
            <CardHeader className="font-bold">판매 정보를 입력해주세요.</CardHeader>
            <CardContent>
              <span className="mr-1 font-medium">매입가: </span>
              <span className="text-blue-600 font-semibold">
                {getDisplayPrice("KRW", c.price * c.exchange.krw)}
                <em className="text-xs text-gray-400 font-normal not-italic">({getDisplayPrice(c.exchange.code, c.price)})</em>
              </span>
            </CardContent>
          </Card>
        ) : (
          <Card className="py-4 gap-2">
            <CardContent>
              {/* 판매가 */}
              <div className="flex justify-between font-medium text-blue-600">
                <span>판매가</span>
                <span className="font-semibold">+ {getDisplayPrice("KRW", s.price)}</span>
              </div>

              {/* 비용 항목들 */}
              <div className="flex justify-between gap-2 ml-3 text-gray-500">
                <span>수수료</span>
                <span>- {getDisplayPrice("KRW", s.fee)}</span>
              </div>
              <div className="flex justify-between gap-2 ml-3 text-gray-500">
                <span>배송료</span>
                <span>- {getDisplayPrice("KRW", s.shipping)}</span>
              </div>
              <div className="flex justify-between gap-2 ml-3 text-gray-500">
                <span>매입가</span>
                <span>
                  - {getDisplayPrice("KRW", c.price * c.exchange.krw)}
                  <em className="text-xs text-gray-400 not-italic">({getDisplayPrice(c.exchange.code, c.price)})</em>
                </span>
              </div>
              {/* 순이익 */}
              <div className="flex justify-between font-semibold text-green-600 border-t border-gray-200 mt-1 pt-1">
                <span>예상 순이익</span>
                <span>{getDisplayPrice("KRW", s.profit)}</span>
              </div>
            </CardContent>
          </Card>
        );
      }

      return <div className="capitalize">{String(value)}</div>;
    },
  }));
  const columns: ColumnDef<ISalesProduct>[] = [
    ...dynamicColumns,
    {
      id: "status",
      header: "상태",
      enableHiding: false,
      cell: ({ row }) => {
        return <TableItemState product={row.original} refetch={fetchProducts} />;
      },
    },
    {
      id: "actions",
      header: "설정",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <BasicTooltip content={row.original.soldAt ? "상품이 판매되어 판매가를 지정할 수 없습니다." : undefined}>
                <div className="w-full">
                  <DropdownMenuItem onClick={() => onClickMoveToUpdate(row.original._id)} disabled={!!row.original.soldAt}>
                    상품 판매 정보 등록
                  </DropdownMenuItem>
                </div>
              </BasicTooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data, // 데이터: row 값?
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // 수정 함수
  const onClickMoveToUpdate = async (selectedItemId: string) => {
    const selectedItem = data.find((el) => el._id === selectedItemId);
    setIsWriteOpen(true);
    setUpdateTarget(selectedItem);
  };

  return (
    <div className="w-full overflow-auto px-6 border bg-white rounded-lg shadow-sm">
      <TableControl table={table} columnConfig={columnConfig} />
      <div className="border rounded-md w-full overflow-x-auto">
        <Table className="w-full min-w-0">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    <div className="px-4 text-center">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-50">
                  <Loader2
                    className="absolute top-1/1.8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-spin text-muted-foreground"
                    aria-label="Loading"
                  />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <PackageOpen className="w-8 h-8 mb-4" />
                    <p className="text-lg font-medium">검색 조건에 맞지 않거나 판매 등록된 상품이 없습니다.</p>
                    <p className="text-sm text-gray-400">검색 조건을 변경하거나 입고된 패키지를 확인해보세요.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={row.original.soldAt ? "bg-green-50 text-green-700" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-3">
        <div className="text-muted-foreground flex-1 text-sm">
          총 {table.getFilteredRowModel().rows.length}개 중 {table.getFilteredSelectedRowModel().rows.length}개 선택됨.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            이전
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
