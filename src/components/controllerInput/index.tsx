import { Control, Controller } from "react-hook-form";

// MUI
import TextField from "@mui/material/TextField";
import { Box, FormHelperText } from "@mui/material";
import { IIncomeItemData } from "@/src/commons/types";

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
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField {...field} label={label} error={!!error} />
          <Box sx={{ height: "1.25rem" }}>
            <FormHelperText error>{error}</FormHelperText>
          </Box>
        </Box>
      )}
    />
  );
}
