
import { Controller, useFormContext } from "react-hook-form";
import { FormElementProps } from "../type";
import { ElementContainer } from "../styled";
import { InputHTMLAttributes } from "react";

type InputProps = FormElementProps & InputHTMLAttributes<HTMLInputElement>;;

function Input({ id, label, hideLabel,  rules, ...others }: InputProps) {
  const form = useFormContext();

  return (
    <ElementContainer>
      {!hideLabel && <label>{label}</label>}
      <Controller
        name={id}
        control={form.control}
        rules={rules}
        render={({ field: { ref, value, ...field } }) => {
          return (
            <input
              // inputRef={ref}
              ref={ref}
              value={value ?? ""}
              {...field}
              {...others}
            />
          );
        }}
      />
    </ElementContainer>
  );
}

export default Input;
