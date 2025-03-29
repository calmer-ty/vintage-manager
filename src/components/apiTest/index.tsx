import axios from "axios";
import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";

// MUI
import TextField from "@mui/material/TextField";
import { db } from "@/commons/libraries/firebase/firebaseApp";
import { Box, Button, Chip, FormHelperText, Snackbar } from "@mui/material";

// TYPE
import { ExchangeRate, IncomeItemData } from "@/commons/types";
import IncomeItemTable from "../incomeItemTable";
import { Controller, useForm } from "react-hook-form";

import * as S from "./styles";

const CACHE_EXPIRY = 60 * 60 * 1000; // 캐시 만료 시간 1시간 (1시간 마다 새로 고침)

export default function ApiTest() {
  const [rates, setRates] = useState<ExchangeRate>();

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

  // 입력하는 내용들
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<IncomeItemData>({
    defaultValues: {
      brandName: "",
      itemName: "",
      JPY: "",
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
    setValue("JPY", value); // react-hook-form에도 업데이트
  };

  // firestore
  // 등록
  const handleFormSubmit = async (data: IncomeItemData) => {
    try {
      // 등록 시간 측정
      const now = new Date(); // 현재 시간을 Date 객체로 가져옴
      const createdAt = now.toISOString(); // ISO 형식으로 문자열 변환

      const docRef = await addDoc(collection(db, "import"), {
        ...data, // IncomeItemData 타입에 있는 모든 데이터
        createdAt, // 테이블 생성 시간
      });
      readData();
      console.log("문서 ID:", docRef.id); // Firestore에서 생성된 고유한 문서 ID
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }
  };

  // 조회
  const [incomeItemArray, setIncomeItemArray] = useState<IncomeItemData[]>([]);
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
    setIncomeItemArray(dataArray as IncomeItemData[]);
  };

  // 처음 로드 시 데이터를 한 번만 조회
  useEffect(() => {
    readData();
  }, []); // 의존성 배열이 비어있으므로 처음 한 번만 실행됨

  return (
    <S.Container>
      <S.Form onSubmit={handleSubmit(handleFormSubmit)}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Controller
            name="brandName"
            control={control}
            rules={{ required: "브랜드명을 입력해 주세요" }}
            render={({ field }) => (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField {...field} error={!!errors.brandName} label="브랜드명" />
                <Box sx={{ height: "1.25rem" }}>
                  <FormHelperText error>{errors.brandName?.message}</FormHelperText>
                </Box>
              </Box>
            )}
          />
          <Controller
            name="itemName"
            control={control}
            rules={{ required: "제품명을 입력해 주세요" }}
            render={({ field }) => (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField {...field} error={!!errors.itemName} label="제품명" />
                <Box sx={{ height: "1.25rem" }}>
                  <FormHelperText error>{errors.itemName?.message}</FormHelperText>
                </Box>
              </Box>
            )}
          />
          <Controller
            name="JPY"
            control={control}
            rules={{ required: "매입 가격(엔화)을 입력해 주세요" }}
            render={({ field }) => (
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <TextField {...field} label="매입 가격(엔화)" error={!!errors.JPY} onChange={handleJPYChange} />
                <Box sx={{ height: "1.25rem" }}>
                  <FormHelperText error>{errors.JPY?.message}</FormHelperText>
                </Box>
              </Box>
            )}
          />
          <Chip label={`원화: ${Math.round(calculateKRW(Number(jpyValue)))}`} variant="outlined" />

          <Button variant="contained" type="submit">
            Contained
          </Button>
        </Box>
      </S.Form>

      <IncomeItemTable incomeItemArray={incomeItemArray} />
    </S.Container>
  );
}
