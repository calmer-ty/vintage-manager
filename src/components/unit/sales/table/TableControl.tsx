import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";

import type { IProduct } from "@/types";
import type { Table } from "@tanstack/react-table";
interface ITableControlProps {
  table: Table<IProduct>;
  columnConfig: {
    key: string;
    label: string;
  }[];
}

export default function TableControl({ table, columnConfig }: ITableControlProps) {
  //  보기 설정용 객체 코드
  const columnLabelMap = Object.fromEntries(columnConfig.map(({ key, label }) => [key, label]));

  return (
    <div className="flex justify-between items-center gap-2 w-full py-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="상품명을 입력해주세요."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm text-sm"
        />
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
      </div>
    </div>
  );
}
