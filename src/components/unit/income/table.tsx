import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";

import ControllerInput from "@/components/commons/controllerInput";
import BasicSelect from "@/components/commons/basicSelect";

import { db } from "@/commons/libraries/firebase/firebaseApp";
import { Button } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";

// TYPE
import { IIncomeItemData } from "@/commons/types";
import { useExchangeRate } from "@/commons/hooks/useExchangeRate";
interface IncomeItemTableProps {
  itemArray: IIncomeItemData[];
  setSelectionItem: React.Dispatch<React.SetStateAction<string[]>>;
}

// const CACHE_EXPIRY = 60 * 60 * 1000; // 캐시 만료 시간 1시간 (1시간 마다 새로 고침)

export default function IncomeTable({ userId }: { userId: string }) {
  // 📦 통화 정보
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  const currencyOptions = useMemo(
    () => [
      { label: "₩", value: baseRate },
      { label: "$", value: usdToKrw },
      { label: "¥", value: jpyToKrw },
    ],
    [baseRate, usdToKrw, jpyToKrw]
  );
  const [currency, setCurrency] = useState(baseRate); // 통화 선택
  const [currencyUnit, setCurrencyUnit] = useState("₩"); // 통화 선택

  // 🏷️ 옵션
  const itemTypeOptions = [
    { label: "상의", value: "상의" },
    { label: "하의", value: "하의" },
    { label: "아우터", value: "아우터" },
    { label: "가방", value: "가방" },
    { label: "액세사리", value: "액세사리" },
    { label: "기타", value: "기타" },
  ];

  // 🧠 상태
  const [itemType, setItemType] = useState(""); // 아이템 타입 선택
  const [selectionItem, setSelectionItem] = useState<string[]>([]);
  const [incomeItemArray, setIncomeItemArray] = useState<IIncomeItemData[]>([]);

  // ✍️ 폼 설정
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IIncomeItemData>({
    defaultValues: {
      brandName: "",
      itemName: "",
      currencyUnit: "",
      price: "",
      priceKRW: "",
    },
  });

  // 🔥 Firestore 관련

  // 📥 등록 함수
  const handleFormSubmit = async (data: IIncomeItemData) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        userId,
        itemType,
        currencyUnit,
        price: `${data.price} ${currencyUnit}`,
        priceKRW: Number(data.price) * Number(currency),
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

    setIncomeItemArray(dataArray as IIncomeItemData[]);
  }, [userId]);

  // 🗑️ 삭제 함수
  const handleFormDelete = async (selectionItem: string[]) => {
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

  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    readData();
  }, [readData]);

  useEffect(() => {
    const selectedOption = currencyOptions.find((opt) => opt.value === currency);
    if (selectedOption) setCurrencyUnit(selectedOption.label);
  }, [currency, currencyOptions]);

  // 아이템 타입 선택

  return (
    <section className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm">
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex items-baseline gap-4 p-6">
          <BasicSelect title="타입" value={itemType} options={itemTypeOptions} setValue={setItemType} />
          <ControllerInput name="brandName" control={control} required="브랜드명을 입력해 주세요" label="브랜드명" error={errors.brandName?.message} />
          <ControllerInput name="itemName" control={control} required="제품명을 입력해 주세요" label="제품명" error={errors.itemName?.message} />
          <ControllerInput name="price" control={control} required="매입 가격을 입력해 주세요" label="매입 가격" error={errors.price?.message} />
          <BasicSelect title="통화" value={currency} options={currencyOptions} setValue={setCurrency} />

          <Button variant="contained" type="submit">
            등록하기
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // 바로 함수가 실행 되기 떄문에 함수 참조를 전달해야합니다.
              handleFormDelete(selectionItem);
            }}
          >
            삭제하기
          </Button>
        </div>
      </form>

      <DataTable itemArray={incomeItemArray} setSelectionItem={setSelectionItem} />
    </section>
  );
}

// Data Table
const paginationModel = { page: 0, pageSize: 5 };

const columns = [
  { field: "createdAt", headerName: "시트 생성 시간", width: 200 },
  { field: "itemType", headerName: "타입", width: 120 },
  { field: "brandName", headerName: "브랜드명", width: 200 },
  { field: "itemName", headerName: "제품명", width: 200 },
  {
    field: "price",
    headerName: "매입 가격(단위)",
    width: 130,
    valueFormatter: (params: string) => {
      // const value = Math.floor(params); // 버림
      const number = Number(params.split(" ")[0]);
      const unit = params.split(" ")[1];
      return `${number.toLocaleString()} ${unit}`;
    },
  },
  {
    field: "priceKRW",
    headerName: "매입 가격(원)",
    width: 130,
    valueFormatter: (params: number) => {
      const value = Math.floor(params); // 버림
      return `${value.toLocaleString()} 원`;
    },
  },
  {
    field: "status",
    headerName: "상태",
    width: 130,
    // valueFormatter: (params: number) => {
    //   const value = Math.floor(params); // 버림
    //   return `${value.toLocaleString()} 원`;
    // },
  },
];

function DataTable({ itemArray, setSelectionItem }: IncomeItemTableProps) {
  // 선택한 행 id들 가져오기
  const handleSelectionChange = (selectionItem: GridRowSelectionModel) => {
    setSelectionItem(selectionItem as string[]);
  };

  // 해석 필요!
  const priceSum = useMemo(() => {
    // reduce()는 배열의 모든 요소를 하나의 값으로 줄이기 위해 사용하는 함수 >> sum은 누적된 값, el은 배열의 각 요소
    return itemArray.reduce((sum, el) => {
      const priceKRW = Number(el.priceKRW);
      return isNaN(priceKRW) ? sum : sum + priceKRW;
    }, 0);
  }, [itemArray]);

  return (
    <div className="h-100 relative">
      <DataGrid
        rows={itemArray}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          "& .MuiDataGrid-container--top [role=row]": {
            backgroundColor: "#f0f0f0", // slate-800 같은 느낌
          },
          border: 0,
        }}
        onRowSelectionModelChange={handleSelectionChange}
      />
      <div className="flex justify-end gap-2 absolute bottom-3 left-50">
        <span>
          총 매입한 가격: <strong>{Math.floor(priceSum).toLocaleString()}</strong> 원
        </span>
        <span>
          총 매물 개수: <strong>{itemArray.length}</strong> 개
        </span>
      </div>
    </div>
  );
}
