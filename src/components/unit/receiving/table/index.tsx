// 라이브러리
import { useState } from "react";
import { deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// 훅
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useUserItems } from "@/hooks/useUserItems";

// 외부 요소
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PackageOpen } from "lucide-react";

// 내부 요소
import ManagementWrite from "./write";
import TableControl from "./control";
import ItemState from "./itemState";

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { IItemData } from "@/types";
import { useProductPackage } from "@/hooks/useProductPackage";
interface IDataTableProps {
  uid: string;
  columnConfig: {
    key: string;
    label: string;
  }[];
}

export default function TableUI({ uid, columnConfig }: IDataTableProps) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { items, createItem, updateItem, fetchItems } = useUserItems({ uid, selectedYear, selectedMonth });
  const { createProductPackage } = useProductPackage({ uid, selectedYear, selectedMonth });

  // 등록/수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IItemData | undefined>(undefined);

  // 수정 함수
  const onClickMoveToUpdate = async (selectedItemId: string) => {
    const selectedItem = items.find((item) => item._id === selectedItemId);
    setUpdateTarget(selectedItem);
    setIsWriteOpen(true);
  };
  // 삭제 함수
  const onClickDelete = async (selectedItems: string[]) => {
    // map / forEach를 쓰지 않는 이유는 비동기적으로 한번에 처리되면 순차적으로 삭제가 되지 않을 수도 있기 때문에 for로 함
    for (const id of selectedItems) {
      try {
        await deleteDoc(doc(db, "items", id));
        console.log(`ID ${id} 삭제 성공`);
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
    fetchItems();
  };

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
        return <ItemState item={row.original} refetch={fetchItems} />;
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

  return (
    <div
      className="w-full overflow-auto mx-auto px-6 border bg-white rounded-lg shadow-sm 
        max-w-xs
        sm:max-w-sm
        md:max-w md
        lg:max-w-lg
        xl:max-w-3xl
        2xl:max-w-5xl
        "
    >
      {/* 다이얼로그 창 */}
      <ManagementWrite
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        uid={uid}
        createProductPackage={createProductPackage}
        updateItem={updateItem}
        fetchItems={fetchItems}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
      />

      <TableControl table={table} setIsOpen={setIsWriteOpen} onClickDelete={onClickDelete} columnConfig={columnConfig} />
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      <div className="px-4">{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    // onClick={}
                    className={row.original.soldAt ? "bg-gray-100" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
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
                    </div>
                  </TableCell>
                </TableRow>
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
      </>
    </div>
  );
}
