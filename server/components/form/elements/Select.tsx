import { Controller, useFormContext } from "react-hook-form";
import { ElementContainer } from "../styled";
import { FormElementProps } from "../type";
import { SelectHTMLAttributes } from "react";

type SelectItem = {
  label: string;
  value: number | string;
};

type SelectProps = FormElementProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    items: SelectItem[];
  };

function Select({
  id,
  label,
  hideLabel,
  items,
  rules,
  ...others
}: SelectProps) {
  const form = useFormContext();

  const { control } = form;

  return (
    <ElementContainer>
      {hideLabel && <label>{label}</label>}
      <Controller
        name={id}
        control={control}
        rules={rules}
        render={({ field }) => {
          return (
            <select {...field} value={field.value ?? ""} {...others}>
              {items?.map((item) => (
                <option value={item.value ?? ""}>{item.label}</option>
              ))}
            </select>
          );
        }}
      />
    </ElementContainer>
  );
}

export default Select;
