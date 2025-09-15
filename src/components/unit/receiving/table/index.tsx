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
import TableDelete from "./delete";
import { ProductList } from "./productList";

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ICurrency, IProductPackage } from "@/types";
interface ITableUIProps {
  data: IProductPackage[];
  columnConfig: {
    key: string;
    label: string;
  }[];
  deleteProductPackage: (packageIds: string[]) => Promise<void>;
  setIsWriteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export default function TableUI({ data, columnConfig, setIsWriteOpen, deleteProductPackage, loading }: ITableUIProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const dynamicColumns: ColumnDef<IProductPackage>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      const value = row.getValue(key);
      const currency: ICurrency = JSON.parse(row.original.currency);

      // 날짜 정보 처리
      if (value instanceof Timestamp) {
        const timestamp = row.getValue(key) as Timestamp;
        return <div className="capitalize">{timestamp.toDate().toLocaleDateString() ?? "판매되지 않음"}</div>;
      }
      if (value == null) {
        return <div>-</div>;
      }

      // 배송비
      if (key === "shipping") {
        return (
          <div className="">
            {value?.toLocaleString()} {currency.label}
          </div>
        );
      }
      // products 일 때, 각 각 상품 정보 표시
      if (key === "products" && Array.isArray(value)) {
        return (
          <div className="flex flex-col gap-1">
            <ProductList products={value} currency={currency} />
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

  // 패키지 데이터 삭제 로직
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]); // 선택된 ID들

  const onClickMoveToDelete = async (packageIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(packageIds);
  };

  return (
    <div className="overflow-auto mx-auto px-6 border bg-white rounded-lg shadow-sm">
      <TableDelete isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteProductPackage={deleteProductPackage} setRowSelection={setRowSelection} />
      <TableControl table={table} columnConfig={columnConfig} setIsOpen={setIsWriteOpen} onClickMoveToDelete={onClickMoveToDelete} />
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
              loading ? (
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
  );
}
