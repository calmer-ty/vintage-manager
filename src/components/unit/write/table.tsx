import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { MoreHorizontal, ChevronDown } from "lucide-react";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Custom
import { IItemData } from "@/types";
import WriteDialog from "./dialog";

const columnLabels: Record<string, string> = {
  category: "상품 종류",
  brandName: "브랜드명",
  name: "상품명",
  price: "가격(단위)",
  priceKRW: "가격(원)",
};

export default function WriteTable({ data, uid, readData }: { data: IItemData[]; uid: string; readData: () => Promise<void> }) {
  // shadcn 테이블 기본 코드
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<IItemData>[] = [
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
    {
      accessorKey: "category",
      header: "상품 종류",
      cell: ({ row }) => <div className="capitalize">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "brandName",
      header: "브랜드명",
      cell: ({ row }) => <div className="capitalize">{row.getValue("brandName")}</div>,
    },
    {
      accessorKey: "name",
      header: "상품명",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "price",
      header: "가격(단위)",
      cell: ({ row }) => <div className="capitalize">{row.getValue("price")}</div>,
    },
    {
      accessorKey: "priceKRW",
      header: "가격(원)",
      cell: ({ row }) => <div className="capitalize">{row.getValue("priceKRW")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const itemData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDelete([itemData._id])}>상품 삭제</DropdownMenuItem>
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

  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original._id);

  // 삭제 함수
  const onDelete = async (selectionItem: string[]) => {
    // map / forEach를 쓰지 않는 이유는 비동기적으로 한번에 처리되면 순차적으로 삭제가 되지 않을 수도 있기 때문에 for로 함
    for (const id of selectionItem) {
      try {
        await deleteDoc(doc(db, "income", id));
        console.log(`ID ${id} 삭제 성공`);
        readData();
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
  };

  return (
    <div className="w-full bg-white px-6 rounded-lg shadow-sm">
      {/* Top */}
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" disabled={selectedIds.length === 0} onClick={() => onDelete(selectedIds)}>
            선택 삭제
          </Button>
          <Input
            placeholder="상품명을 입력해주세요."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* ItemDialog */}
          <WriteDialog uid={uid} readData={readData} />
          {/* DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                보기 설정 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {columnLabels[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  등록된 상품 없음.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Bottom */}
      <div className="flex items-center justify-end space-x-2 py-4">
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
