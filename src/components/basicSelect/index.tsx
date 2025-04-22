import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface IBasicSelectProps {
  title: string;
  value: string;
  options: {
    label: string;
    value: string | number;
  }[];
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function BasicSelect({ title, value, options, setValue }: IBasicSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 80 }}>
      <InputLabel id="select-label">{title}</InputLabel>
      <Select labelId="select-label" id="basic-select" value={value} label={title} onChange={handleChange} sx={{ backgroundColor: "#fff" }}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
