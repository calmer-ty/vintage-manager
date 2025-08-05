import { useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PackageOpen } from "lucide-react";

import ControlTable from "./control";
import ManagementCreate from "@/components/unit/management/create";

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { IItemData } from "@/types";

interface IDataTableProps {
  data: IItemData[];
  uid: string;
  refetch: () => Promise<void>;
  columnConfig: {
    key: string;
    label: string;
  }[];
  renderStatusCell?: (itemData: IItemData) => React.ReactNode;
}

export default function TableUI({ data, uid, refetch, columnConfig, renderStatusCell }: IDataTableProps) {
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
        return <div className="capitalize">{timestamp.toDate().toLocaleDateString()}</div>;
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
    ...(renderStatusCell
      ? [
          {
            id: "actions",
            header: "상태",
            enableHiding: false,
            cell: ({ row }) => {
              const itemData = row.original;
              return renderStatusCell(itemData); // ✅ 여기서 호출
            },
          } as ColumnDef<IItemData>,
        ]
      : []),
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

  // 삭제 함수
  const onDelete = async (selectionItem: string[]) => {
    // map / forEach를 쓰지 않는 이유는 비동기적으로 한번에 처리되면 순차적으로 삭제가 되지 않을 수도 있기 때문에 for로 함
    for (const id of selectionItem) {
      try {
        await deleteDoc(doc(db, "items", id));
        console.log(`ID ${id} 삭제 성공`);
        refetch();
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
  };

  return (
    <div
      className="overflow-auto px-6 border rounded-lg shadow-sm 
        max-w-xs
        sm:max-w-md
        lg:max-w-xl
        2xl:max-w-max"
    >
      <div className="flex items-center gap-2">
        <ControlTable table={table} onDelete={onDelete} columnConfig={columnConfig} />
        <ManagementCreate uid={uid} refetch={refetch} />
      </div>

      <div className="border rounded-md">
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
          <TableBody className="min-h-[400px]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className={row.original.soldAt ? "bg-gray-100" : ""}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <PackageOpen className="w-8 h-8 mb-4" />
                    <p className="text-lg font-medium">등록된 상품이 없습니다.</p>
                    <p className="text-sm text-gray-400">상품을 추가하면 이곳에 표시됩니다.</p>
                    {/* <Button className="mt-4" onClick={() => setShowModal(true)}>
                      상품 등록하기
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
