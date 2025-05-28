import { Controller, useFormContext } from "react-hook-form";
import { FormElementProps } from "../type";
import { ElementContainer } from "../styled";
import { InputHTMLAttributes } from "react";

type CheckboxProps = FormElementProps & InputHTMLAttributes<HTMLInputElement>;

function Checkbox({ id, label, hideLabel, rules, ...others }: CheckboxProps) {
  const form = useFormContext();

  const { control } = form;

  return (
    <ElementContainer style={{ flexDirection: "row", alignItems: "center" }}>
      {!hideLabel && <label>{label}</label>}
      <Controller
        name={id}
        control={control}
        rules={rules}
        render={({ field }) => (
          <input
            {...field}
            onChange={(e) => field.onChange(e.target.checked)}
            checked={field.value ?? ""}
            {...others}
            type="checkbox"
          />
        )}
      />
    </ElementContainer>
  );
}

export default Checkbox;
