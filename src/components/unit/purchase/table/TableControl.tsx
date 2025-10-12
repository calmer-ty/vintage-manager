import { ChevronDown, Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

import type { IPurchaseSingle } from "@/types";
import type { Table } from "@tanstack/react-table";
interface ITableControlProps {
  table: Table<IPurchaseSingle>;
  columnConfig: {
    key: string;
    label: string;
  }[];
  setIsWriteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClickMoveToDelete: (selectedPurchasesId: string[]) => void;
}

export default function TableControl({ table, columnConfig, setIsWriteOpen, onClickMoveToDelete }: ITableControlProps) {
  //  선택한 체크박스
  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original._id);
  //  보기 설정용 객체 코드
  const columnLabelMap = Object.fromEntries(columnConfig.map(({ key, label }) => [key, label]));

  const onClickCreate = () => {
    setIsWriteOpen(true);
  };

  return (
    <div className="flex justify-between items-center gap-2 w-full py-3">
      <div className="flex items-center gap-2">
        <Button variant="destructive" size="sm" disabled={selectedIds.length === 0} onClick={() => onClickMoveToDelete(selectedIds)}>
          <span className="hidden sm:block">선택 삭제</span>
          <Trash
            className="w-4 h-4 
              block sm:hidden"
          />
        </Button>
        {/* <Input
          placeholder="상품명을 입력해주세요."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm text-sm"
        /> */}
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span className="hidden sm:block">보기 설정</span>
              <Settings
                className="w-4 h-4 
              block sm:hidden"
              />
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {columnLabelMap[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="default" onClick={onClickCreate}>
          <span className="hidden sm:block">패키지 등록</span>
          <Pencil
            className="w-4 h-4 
              block sm:hidden"
          />
        </Button>
      </div>
    </div>
  );
}
