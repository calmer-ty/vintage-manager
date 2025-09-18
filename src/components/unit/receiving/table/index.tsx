// 라이브러리
import { useState } from "react";

import { Timestamp } from "firebase/firestore";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// 외부 요소
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, PackageOpen } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import TableControl from "./control";

import { ProductList } from "./productList";

import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ICreateProductParams, IProductPackage } from "@/types";
interface ITableUIProps {
  setIsWriteOpen: Dispatch<SetStateAction<boolean>>;
  setUpdateTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;

  data: IProductPackage[];
  columnConfig: {
    key: string;
    label: string;
  }[];
  onClickMoveToUpdate: (rowId: string) => void;
  onClickMoveToDelete: (rowIds: string[]) => void;
  onClickMoveToSale: (rowId: string) => void;
  deleteProductPackage: (packageIds: string[]) => Promise<void>;
  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
  packagesLoading: boolean;
}

export default function TableUI({ setIsWriteOpen, onClickMoveToUpdate, onClickMoveToDelete, onClickMoveToSale, data, columnConfig, packagesLoading }: ITableUIProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const dynamicColumns: ColumnDef<IProductPackage>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      const value = row.getValue(key);

      const products = row.original.products;
      // const shipping = row.original.shipping;

      // 날짜 정보 처리
      if (value instanceof Timestamp) {
        const timestamp = row.getValue(key) as Timestamp;
        return <div className="capitalize">{timestamp.toDate().toLocaleDateString() ?? "판매되지 않음"}</div>;
      }
      if (value == null) {
        return <div>-</div>;
      }

      // 배송비
      // if (key === "shipping") {
      //   return (
      //     <span>
      //       {shipping.amount.toLocaleString()} {shipping.currency === "" ? "-" : JSON.parse(shipping.currency).label}
      //     </span>
      //   );
      // }

      // products 일 때, 각 각 상품 정보 표시
      if (key === "products") {
        return (
          <div className="flex flex-col gap-1">
            <ProductList products={products} />
          </div>
        );
      }

      return <div className="capitalize">{String(value)}</div>;
    },
  }));
  const columns: ColumnDef<IProductPackage>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
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
              <DropdownMenuItem onClick={() => onClickMoveToSale(row.original._id)}>판매 등록</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickMoveToUpdate(row.original._id)}>패키지 수정</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickMoveToDelete([row.original._id])}>패키지 삭제</DropdownMenuItem>
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
      <div className="overflow-auto px-6 border bg-white rounded-lg shadow-sm">
        <TableControl table={table} columnConfig={columnConfig} setIsWriteOpen={setIsWriteOpen} onClickMoveToDelete={onClickMoveToDelete} />
        <div className="border rounded-md">
          <Table>
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
              {
                // 로딩 중일 때
                packagesLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-50">
                      <Loader2 className="absolute top-1/1.8 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-spin text-muted-foreground" aria-label="Loading" />
                    </TableCell>
                  </TableRow>
                ) : // 데이터가 없을 때
                table.getRowModel().rows?.length === 0 ? (
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
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
