// 라이브러리
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

// 훅
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

// 외부 요소
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PackageOpen } from "lucide-react";

// 내부 요소
import ReceivingWrite from "../write";
import TableControl from "./control";

import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import type { ICurrency, IProductPackage, IReceivingProduct } from "@/types";
interface IDataTableProps {
  uid: string;
  columnConfig: {
    key: string;
    label: string;
  }[];
}

export default function TableUI({ uid, columnConfig }: IDataTableProps) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { productPackages, createProductPackage, deleteProductPackage, fetchProductPackages } = useProductPackages({ uid, selectedYear, selectedMonth });

  // 등록/수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]); // 선택된 ID들
  const [updateTarget, setUpdateTarget] = useState<IProductPackage | undefined>(undefined);

  // shadcn 테이블 기본 코드
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

      if (value instanceof Timestamp) {
        // Timestamp일 때만 처리
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
            {value.map((p: IReceivingProduct, idx: number) => (
              <div key={idx} className="flex justify-between gap-4 p-2 border rounded-md">
                <span className="">
                  {p.brand} - {p.name}
                </span>
                <span className="text-sm text-gray-500">
                  {Number(p.costPrice).toLocaleString()} {currency.label}
                </span>
              </div>
            ))}
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
              {/* <DropdownMenuItem onClick={() => onClickMoveToUpdate(row.original._id)}>패키지 수정</DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => onClickMoveToDelete([row.original._id])}>패키지 삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const table = useReactTable({
    data: productPackages, // 데이터: row 값?
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
  // const onClickMoveToUpdate = (selectedProductPackageId: string) => {
  //   const selectedProductPackage = productPackages.find((el) => el._id === selectedProductPackageId);
  //   setUpdateTarget(selectedProductPackage);
  //   setIsWriteOpen(true);
  // };

  // 삭제 함수
  const onClickMoveToDelete = async (packageIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(packageIds);
  };
  const onClickDelete = async (packageIds: string[]) => {
    await deleteProductPackage(packageIds);
    setRowSelection({});
  };

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
      {/* 등록/수정 모달 */}
      <ReceivingWrite
        uid={uid}
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
        createProductPackage={createProductPackage}
        fetchProductPackages={fetchProductPackages}
      />

      {/* 삭제 모달 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 삭제하면 복구할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                await onClickDelete(deleteTargets);
                setIsDeleteOpen(false);
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TableControl table={table} columnConfig={columnConfig} setIsOpen={setIsWriteOpen} onClickMoveToDelete={onClickMoveToDelete} />
      <>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
