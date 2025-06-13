"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Custom
import { useForm } from "react-hook-form";
import { IItemData } from "@/commons/types";
import { db } from "@/commons/libraries/firebase/firebaseApp";
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useExchangeRate } from "@/commons/hooks/useExchangeRate";

import ControllerInput from "@/components/commons/controllerInput";
import BasicSelect from "@/components/commons/basicSelect";

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
    accessorKey: "itemType",
    header: "상품 타입",
    cell: ({ row }) => <div className="capitalize">{row.getValue("itemType")}</div>,
  },
  {
    accessorKey: "brandName",
    header: "브랜드명",
    cell: ({ row }) => <div className="capitalize">{row.getValue("brandName")}</div>,
  },
  {
    accessorKey: "itemName",
    header: "상품명",
    cell: ({ row }) => <div className="capitalize">{row.getValue("itemName")}</div>,
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
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// 🏷️ 옵션
const itemTypeOptions = [
  { label: "상의", value: "상의" },
  { label: "하의", value: "하의" },
  { label: "아우터", value: "아우터" },
  { label: "가방", value: "가방" },
  { label: "액세사리", value: "액세사리" },
  { label: "기타", value: "기타" },
];

export default function ItemTable({ userId }: { userId: string }) {
  // Custom
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  const [itemDataArray, setItemDataArray] = useState<IItemData[]>([]);

  const currencyOptions = useMemo(
    () => [
      { label: "₩", value: baseRate },
      { label: "$", value: usdToKrw },
      { label: "¥", value: jpyToKrw },
    ],
    [baseRate, usdToKrw, jpyToKrw]
  );

  // ✍️ 폼 설정
  const {
    handleSubmit: handleFormSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IItemData>({
    defaultValues: {
      brandName: "",
      itemName: "",
      currencyUnit: "",
      price: "",
      priceKRW: "",
    },
  });

  // 🧠 상태
  const [itemType, setItemType] = useState(""); // 아이템 타입 선택

  // 💰 통화
  const [selectedCurrencyValue, setSelectedCurrencyValue] = useState(baseRate); // 통화 선택
  const [selectedCurrencyLabel, setSelectedCurrencyLabel] = useState("₩"); // 통화 선택

  // 🖊️ 등록 함수
  const handleSubmit = async (data: IItemData) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        userId,
        itemType,
        selectedCurrencyLabel,
        price: `${data.price} ${selectedCurrencyLabel}`,
        priceKRW: Number(data.price) * Number(selectedCurrencyValue),
        createdAt, // 테이블 생성 시간
      });
      reset();
      readData();
      console.log("문서 ID:", docRef.id); // Firestore에서 생성된 고유한 문서 ID
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };
  // 📄 조회 함수
  const readData = useCallback(async () => {
    const q = query(collection(db, "income"), where("userId", "==", userId), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setItemDataArray(dataArray as IItemData[]);
  }, [userId]);

  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    readData();
  }, [readData]);

  // 선택한 통화 값이 일치하면 통화 라벨을 업데이트 시키기 위함
  useEffect(() => {
    const selectedOption = currencyOptions.find((opt) => opt.value === selectedCurrencyValue);
    if (selectedOption) setSelectedCurrencyLabel(selectedOption.label);
  }, [selectedCurrencyValue, currencyOptions]);

  // shadcn 테이블 기본 코드
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: itemDataArray, // 데이터: row 값?
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
    <div className="w-full bg-white px-6 mx-4 rounded-lg">
      <form onSubmit={handleFormSubmit(handleSubmit)}>
        <div className="flex items-baseline gap-4 p-6">
          <BasicSelect title="타입" value={itemType} options={itemTypeOptions} setValue={setItemType} />
          <ControllerInput name="brandName" control={control} required="브랜드명을 입력해 주세요" label="브랜드명" error={errors.brandName?.message} />
          <ControllerInput name="itemName" control={control} required="제품명을 입력해 주세요" label="제품명" error={errors.itemName?.message} />
          <ControllerInput name="price" control={control} required="매입 가격을 입력해 주세요" label="매입 가격" error={errors.price?.message} />
          <BasicSelect title="통화" value={selectedCurrencyValue} options={currencyOptions} setValue={setSelectedCurrencyValue} />

          <Button variant="outline" size="sm" type="submit">
            등록하기
          </Button>
          {/* <button
            onClick={() => {
              // 바로 함수가 실행 되기 떄문에 함수 참조를 전달해야합니다.
              handleFormDelete(selectionItem);
            }}
          >
            삭제하기
          </button> */}
        </div>
      </form>

      <div className="flex items-center py-4">
        <Input
          placeholder="상품명을 입력해주세요."
          value={(table.getColumn("itemName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("itemName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
