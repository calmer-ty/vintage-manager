import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";

import DataTable from "../../components/dataTable";
// MUI

import { db } from "@/commons/libraries/firebase/firebaseApp";
import { Box, Button, Chip } from "@mui/material";

import * as S from "./styles";
// TYPE
import { IExchangeRate, IIncomeItemData } from "@/commons/types";
import ControllerInput from "@/components/controllerInput";
import CurrencySelect from "@/components/currencySelect";

const CACHE_EXPIRY = 60 * 60 * 1000; // 캐시 만료 시간 1시간 (1시간 마다 새로 고침)

export default function ApiTest() {
  const [rates, setRates] = useState<IExchangeRate>();
  const [selectionItem, setSelectionItem] = useState<string[]>([]);
  console.log(selectionItem);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const cachedData = localStorage.getItem("exchangeRate");
      const cachedTime = localStorage.getItem("exchangeRateTime");
      const currentTime = new Date().getTime();

      // 1시간 이내에 데이터가 있으면 로컬스토리지 데이터 사용
      if (cachedData && cachedTime && currentTime - Number(cachedTime) < CACHE_EXPIRY) {
        setRates(JSON.parse(cachedData)); // 로컬스토리지 데이터 사용
        return;
      }

      // 캐시가 없거나 만료된 경우 새로 API 호출
      // const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.NEXT_PUBLIC_EXCHANGE_RATE_APIKEY}&symbols=JPY,KRW`;
      const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${process.env.NEXT_PUBLIC_GOVERNMENTDATA}&searchdate=20250325&data=AP01`;
      try {
        const response = await axios.get(url);
        setRates(response.data);

        // 새로운 데이터를 로컬스토리지에 저장
        localStorage.setItem("exchangeRate", JSON.stringify(response.data));
        localStorage.setItem("exchangeRateTime", currentTime.toString());
      } catch (error) {
        console.log(error);
      }
    };
    fetchExchangeRate();
  }, []);

  // 1달러 당
  const usdToJPY = 150.06;
  const usdToKRW = 1467.6;

  // 엔화 대비 원화 계산 비율
  const JPYPerKrw = usdToKRW / usdToJPY;

  // React hook form - 입력하는 내용
  const {
    handleSubmit,
    setValue,
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
  const [jpyValue, setJpyValue] = useState<string>("");

  const calculateKRW = (JPY: number) => {
    if (isNaN(JPY) || JPY <= 0) return 0; // 값이 없거나 0보다 아래면 0으로 만듦
    return JPY * JPYPerKrw; // 그 후에 엔화에다 엔 원화 비율 값을 곱해 1엔당 x원을 찾음
  };
  const handleJPYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setJpyValue(value); // event.target.value는 입력 필드의 현재 값
    setValue("price", value); // react-hook-form에도 업데이트
  };

  // firestore
  // 등록
  const handleFormSubmit = async (data: IIncomeItemData) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "import"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
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
      collection(db, "import"),
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
        await deleteDoc(doc(db, "import", id));
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

  // 통화 선택
  const [currency, setCurrency] = useState("");

  console.log(errors.brandName);

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <ControllerInput name="brandName" control={control} required="브랜드명을 입력해 주세요" label="브랜드명" error={errors.brandName?.message} />
          <ControllerInput name="itemName" control={control} required="제품명을 입력해 주세요" label="제품명" error={errors.itemName?.message} />
          <CurrencySelect currency={currency} setCurrency={setCurrency} />
          <ControllerInput name="price" control={control} required="매입 가격을 입력해 주세요" label="매입 가격" error={errors.price?.message} />

          {/* <Chip label={`원화: ${Math.round(calculateKRW(Number(jpyValue)))}`} variant="outlined" /> */}

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
