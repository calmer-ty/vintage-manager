// shadcn 에서 기존에 정의된 코드

import { useState } from "react";

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import CellSelect from "./cellSelect";

import { Timestamp } from "firebase/firestore";
import type { IItemData } from "@/types";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
interface ITableConfigProps {
  items: IItemData[];
  columnConfig: {
    key: string;
    label: string;
  }[];
  fetchItems: () => Promise<void>;
  onClickMoveToUpdate: (selectedItemId: string) => Promise<void>;
  onClickDelete: (selectedItems: string[]) => Promise<void>;
}

export const useTable = ({ items, columnConfig, fetchItems, onClickMoveToUpdate, onClickDelete }: ITableConfigProps) => {
  // shadcn 테이블 기본 코드
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const dynamicColumns: ColumnDef<IItemData>[] = columnConfig.map(({ key, label }) => ({
    accessorKey: key,
    header: label,
    cell: ({ row }) => {
      // 숫자라면 toLocaleString으로 포맷 (예: 가격)
      if (typeof row.getValue(key) === "number") {
        return <div className="capitalize">{row.getValue(key)?.toLocaleString()}</div>;
      }
      if (row.getValue(key) instanceof Timestamp) {
        // Timestamp일 때만 처리
        const timestamp = row.getValue(key) as Timestamp;
        return <div className="capitalize">{timestamp.toDate().toLocaleDateString() ?? "판매되지 않음"}</div>;
      }
      if (row.getValue(key) == null) {
        return <div className="capitalize">-</div>;
      }

      return <div className="capitalize">{row.getValue(key)}</div>;
    },
  }));
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
    ...dynamicColumns,
    {
      id: "status",
      header: "상태",
      enableHiding: false,
      cell: ({ row }) => {
        return <CellSelect item={row.original} refetch={fetchItems} />;
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
              <DropdownMenuItem onClick={() => onClickMoveToUpdate(row.original._id)}>상품 수정</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClickDelete([row.original._id])}>상품 삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: items, // 데이터: row 값?
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

  return {
    table,
    columns,
  };
};
