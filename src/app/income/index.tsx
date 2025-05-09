import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";

import ControllerInput from "@/components/controllerInput";
import DataTable from "@/components/dataTable";
// MUI
import { db } from "@/commons/libraries/firebase/firebaseApp";
import { Box, Button } from "@mui/material";

import * as S from "./styles";
// TYPE
import { IIncomeItemData } from "@/commons/types";
import BasicSelect from "@/components/basicSelect";
import { useExchangeRate } from "@/commons/hooks/useExchangeRate";

// const CACHE_EXPIRY = 60 * 60 * 1000; // 캐시 만료 시간 1시간 (1시간 마다 새로 고침)

export default function IncomePage() {
  const [selectionItem, setSelectionItem] = useState<string[]>([]);

  // React hook form - 입력하는 내용
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<IIncomeItemData>({
    defaultValues: {
      brandName: "",
      itemName: "",
      price: "",
    },
  });

  // firestore
  // 등록
  const handleFormSubmit = async (data: IIncomeItemData) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "income"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        itemType,
        price: Number(data.price) * Number(currency),
        createdAt, // 테이블 생성 시간
      });
      reset();
      readData();
      console.log("문서 ID:", docRef.id); // Firestore에서 생성된 고유한 문서 ID
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 조회
  const [incomeItemArray, setIncomeItemArray] = useState<IIncomeItemData[]>([]);
  const readData = async () => {
    const q = query(
      collection(db, "income"),
      orderBy("createdAt", "desc") // createdAt 기준 내림차순 정렬
    );

    // 위에서 데이터를 정렬하고 조회
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id, // 문서의 ID
      ...doc.data(), // 문서의 데이터
    }));
    setIncomeItemArray(dataArray as IIncomeItemData[]);
  };

  // 삭제
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
  }, []); // 의존성 배열이 비어있으므로 처음 한 번만 실행됨

  // 아이템 타입 선택
  const [itemType, setItemType] = useState("");
  const itemTypeOptions = [
    { label: "상의", value: "상의" },
    { label: "하의", value: "하의" },
    { label: "아우터", value: "아우터" },
  ];
  console.log(itemType);

  // 통화 선택
  const [currency, setCurrency] = useState("");
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();
  const currencyOptions = [
    { label: "₩", value: baseRate },
    { label: "$", value: usdToKrw },
    { label: "¥", value: jpyToKrw },
  ];

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "baseline" }}>
          {/* <CurrencySelect currency={currency} setCurrency={setCurrency} /> */}
          <BasicSelect title="타입" value={itemType} options={itemTypeOptions} setValue={setItemType} />
          <ControllerInput name="brandName" control={control} required="브랜드명을 입력해 주세요" label="브랜드명" error={errors.brandName?.message} />
          <ControllerInput name="itemName" control={control} required="제품명을 입력해 주세요" label="제품명" error={errors.itemName?.message} />
          <BasicSelect title="통화" value={currency} options={currencyOptions} setValue={setCurrency} />
          <ControllerInput name="price" control={control} required="매입 가격을 입력해 주세요" label="매입 가격" error={errors.price?.message} />

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
        </Box>
      </S.Form>

      <DataTable incomeItemArray={incomeItemArray} setSelectionItem={setSelectionItem} />
    </S.Container>
  );
}
