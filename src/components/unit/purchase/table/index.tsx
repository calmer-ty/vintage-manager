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

import { useCurrency } from "@/contexts/currencyContext";
import { getDisplayPrice, getExchangeDisplayPrice } from "@/lib/price";

// 외부 요소
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PackageOpen } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import ChildrenTooltip from "@/components/commons/ChildrenTooltip";
import TableItem from "./TableItem";
import TableControl from "./TableControl";

import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef, ColumnFiltersState, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ICreateProductParams, IPackage } from "@/types";
interface IReceivingTableProps {
  data: IPackage[];
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  onClickMoveToCreate: () => void;
  onClickMoveToMerge: (rowData: IPackage[]) => void;
  onClickMoveToSale: (rowData: IPackage) => void;
  onClickMoveToDelete: (rowIds: string[]) => void;
  createProduct: ({ productDocs }: ICreateProductParams) => Promise<void>;
  fetchLoading: boolean;
}

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "products", label: "패키지 정보" },
  { key: "shipping", label: "국제 배송료" },
];

export default function PurchaseTable({
  data,
  rowSelection,
  setRowSelection,
  onClickMoveToCreate,
  onClickMoveToDelete,
  onClickMoveToMerge,
  onClickMoveToSale,
  fetchLoading,
}: IReceivingTableProps) {
  const { viewCurrency } = useCurrency();

  // const [sorting, setSorting] = useState<SortingState>([{ id: "shippingSort", desc: false }]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ shippingSort: false }); // shippingSort 컬럼 숨기기

  const dynamicColumns: ColumnDef<IPackage>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      const value = row.getValue(key);

      // 날짜 정보 처리
      if (value instanceof Timestamp) {
        const timestamp = row.getValue(key) as Timestamp;
        return <span className="capitalize">{timestamp.toDate().toLocaleDateString() ?? "판매되지 않음"}</span>;
      }
      if (value == null || value === "") {
        return <span>-</span>;
      }
      if (key === "shipping" && row.original.shipping != null) {
        const s = row.original.shipping;
        return (
          <span>
            {getDisplayPrice(s.exchange.code, s.amount)}
            <em className="text-xs not-italic text-gray-500">({getExchangeDisplayPrice(viewCurrency, s.amount, s.exchange)})</em>
          </span>
        );
      }
      // products 일 때, 각 각 상품 정보 표시
      if (key === "products") {
        return <TableItem products={row.original.products} viewCurrency={viewCurrency} />;
      }

      return <div className="capitalize">{String(value)}</div>;
    },
  }));
  const columns: ColumnDef<IPackage>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const selectableRows = table.getRowModel().rows.filter((row) => !row.original.addSaleAt); // addSaleAt 없는 행만 선택 가능
        const allSelected = selectableRows.length > 0 && selectableRows.every((row) => row.getIsSelected()); // 선택 가능한 행이 모두 선택되었는지 확인

        return (
          <Checkbox
            // 기존 코드
            // checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            // onCheckedChange={(value) => {
            // table.toggleAllPageRowsSelected(!!value);
            // }}
            checked={allSelected}
            onCheckedChange={(value) => {
              selectableRows.forEach((row) => row.toggleSelected(!!value));
            }}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          disabled={!!row.original.addSaleAt}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   id: "shippingSort",
    //   accessorFn: (row) => (row.shipping ? 1 : 0), // shipping 있으면 1, 없으면 0
    //   enableSorting: true,
    //   enableHiding: false, // shippingSort UI에서 숨김
    // },
    ...dynamicColumns,
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
              <ChildrenTooltip content={!!row.original.addSaleAt ? "패키지가 판매 등록되어 설정할 수 없습니다." : ""}>
                <div className="w-full">
                  <DropdownMenuItem onClick={() => onClickMoveToSale(row.original)} disabled={!!row.original.addSaleAt}>
                    판매 등록
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onClickMoveToDelete([row.original._id])} disabled={!!row.original.addSaleAt}>
                    패키지 삭제
                  </DropdownMenuItem>
                </div>
              </ChildrenTooltip>
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

  return (
    <>
      <div className="px-6 border bg-white rounded-lg shadow-sm">
        <TableControl
          table={table}
          columnConfig={columnConfig}
          onClickMoveToCreate={onClickMoveToCreate}
          onClickMoveToMerge={onClickMoveToMerge}
          onClickMoveToDelete={onClickMoveToDelete}
        />
        <div className="border rounded-md">
          <Table>
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
              {
                // 로딩 중일 때
                fetchLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-50">
                      <Loader2
                        className="absolute top-1/1.8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-spin text-muted-foreground"
                        aria-label="Loading"
                      />
                    </TableCell>
                  </TableRow>
                ) : // 데이터가 없을 때
                table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <PackageOpen className="w-8 h-8 mb-4" />
                        <p className="text-lg font-medium">등록된 상품이 없습니다.</p>
                        <p className="text-sm text-gray-400">패키지를 추가하면 이곳에 표시됩니다.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // 데이터가 있을 때
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={row.original.addSaleAt ? "bg-red-50" : ""}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )
              }
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
    </>
  );
}
