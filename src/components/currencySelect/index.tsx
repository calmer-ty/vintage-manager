import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface ICurrencySelectProps {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

export default function CurrencySelect({ currency, setCurrency }: ICurrencySelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);
  };

  return (
    <FormControl sx={{ minWidth: 80 }}>
      <InputLabel id="select-label">통화</InputLabel>
      <Select labelId="select-label" id="currency-select" value={currency} label="통화" onChange={handleChange} sx={{ backgroundColor: "#fff" }}>
        <MenuItem value={10}>₩</MenuItem>
        <MenuItem value={20}>$</MenuItem>
        <MenuItem value={30}>¥</MenuItem>
      </Select>
    </FormControl>
  );
}
