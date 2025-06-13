import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

// Custom
import { useForm } from "react-hook-form";
import { IItemData } from "@/commons/types";
import { db } from "@/commons/libraries/firebase/firebaseApp";
import { addDoc, collection } from "firebase/firestore";
import { useExchangeRate } from "@/commons/hooks/useExchangeRate";

import ControllerInput from "@/components/commons/controllerInput";
import BasicSelect from "@/components/commons/basicSelect";

// 🏷️ 옵션
const itemTypeOptions = [
  { label: "상의", value: "상의" },
  { label: "하의", value: "하의" },
  { label: "아우터", value: "아우터" },
  { label: "가방", value: "가방" },
  { label: "액세사리", value: "액세사리" },
  { label: "기타", value: "기타" },
];
interface IItemInputProps {
  userId: string;
  readData: () => Promise<void>;
}
export default function ItemInput({ userId, readData }: IItemInputProps) {
  // Custom
  const { baseRate, usdToKrw, jpyToKrw } = useExchangeRate();

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

  // 선택한 통화 값이 일치하면 통화 라벨을 업데이트 시키기 위함
  useEffect(() => {
    const selectedOption = currencyOptions.find((opt) => opt.value === selectedCurrencyValue);
    if (selectedOption) setSelectedCurrencyLabel(selectedOption.label);
  }, [selectedCurrencyValue, currencyOptions]);

  return (
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
  );
}
