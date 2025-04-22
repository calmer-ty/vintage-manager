import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface ICurrencySelectProps {
  title: string;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

export default function CurrencySelect({ title, currency, setCurrency }: ICurrencySelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setCurrency(event.target.value as string);
  };

  return (
    <FormControl sx={{ minWidth: 80 }}>
      <InputLabel id="select-label">{title}</InputLabel>
      <Select labelId="select-label" id="currency-select" value={currency} label="통화" onChange={handleChange} sx={{ backgroundColor: "#fff" }}>
        <MenuItem value={1}>₩</MenuItem>
        <MenuItem value={1425.23}>$</MenuItem>
        <MenuItem value={10.14}>¥</MenuItem>
      </Select>
    </FormControl>
  );
}
