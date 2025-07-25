import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type { IItemData } from "@/types";
import type { Table } from "@tanstack/react-table";

interface IControlTableProps {
  table: Table<IItemData>;
  columnConfig: {
    key: string;
    label: string;
  }[];
  onDelete: (selectionItem: string[]) => Promise<void>;
}

export default function ControlTable({ table, columnConfig, onDelete }: IControlTableProps) {
  //   선택한 체크박스
  const selectedIds = table.getSelectedRowModel().rows.map((row) => row.original._id);

  //   보기 설정용 객체 코드
  const columnLabelMap = Object.fromEntries(columnConfig.map(({ key, label }) => [key, label]));

  return (
    <div className="flex justify-between items-center w-full py-4">
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
                  {columnLabelMap[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
