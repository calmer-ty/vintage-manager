import { Control, Controller } from "react-hook-form";

// MUI
import TextField from "@mui/material/TextField";
import { IIncomeItemData } from "@/commons/types";

interface IControllerInputProps {
  name: keyof IIncomeItemData;
  control: Control<IIncomeItemData, unknown, IIncomeItemData>;
  required: string;
  label: string;
  error: string | undefined;
}

export default function ControllerInput({ name, control, required, label, error }: IControllerInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <div className="flex flex-col">
          <TextField {...field} label={label} error={!!error} sx={{ bgcolor: "#fff" }} />
        </div>
      )}
    />
  );
}
