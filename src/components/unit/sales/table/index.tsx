// 라이브러리
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { getPriceInKRW } from "@/lib/price";

// 외부 요소
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PackageOpen } from "lucide-react";

// 내부 요소
import TableControl from "./control";
import ItemState from "./itemState";
import BasicTooltip from "@/components/commons/tooltip/basic";

import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ICurrency, IProduct } from "@/types";
interface ISalesTableProps {
  data: IProduct[];
  columnConfig: {
    key: string;
    label: string;
  }[];

  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateTarget: Dispatch<SetStateAction<IProduct | undefined>>;
  fetchProducts: () => Promise<void>;
  loading: boolean;
}

export default function SalesTable({ data, columnConfig, setIsWriteOpen, setUpdateTarget, fetchProducts, loading }: ISalesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const dynamicColumns: ColumnDef<IProduct>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      const value = row.getValue(key);

      const costPrice = row.original.costPrice;
      const costPriceCurrency: ICurrency = JSON.parse(costPrice.currency);
      const salePrice = row.original.salePrice;
      const profit = row.original.profit;

      if (value instanceof Timestamp) {
        // Timestamp일 때만 처리
        const timestamp = value as Timestamp;
        return <div>{timestamp.toDate().toLocaleDateString() ?? "판매되지 않음"}</div>;
      }
      if (value == null || value === "") {
        return <div>-</div>;
      }

      if (key === "costPrice") {
        return (
          <div className="flex justify-end items-center gap-1">
            <span>{getPriceInKRW(costPrice.amount, costPriceCurrency.krw).toLocaleString()} ₩</span>
            <span className="text-xs text-gray-500">
              ({Number(costPrice.amount).toLocaleString()} {costPriceCurrency.label})
            </span>
          </div>
        );
      }
      if (key === "salePrice") {
        return <div className="text-right">{Number(salePrice).toLocaleString()} ₩</div>;
      }
      if (key === "profit") {
        return <div className="text-right">{Number(profit).toLocaleString()} ₩</div>;
      }

      return <div className="capitalize">{String(value)}</div>;
    },
  }));
  const columns: ColumnDef<IProduct>[] = [
    ...dynamicColumns,
    {
      id: "status",
      header: "상태",
      enableHiding: false,
      cell: ({ row }) => {
        return <ItemState product={row.original} refetch={fetchProducts} />;
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
                    상품 판매가 지정
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
                    <div className="px-4 text-center">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center h-50">
                  <Loader2 className="absolute top-1/1.8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-spin text-muted-foreground" aria-label="Loading" />
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={row.original.soldAt ? "bg-green-50 text-green-700" : ""}>
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
