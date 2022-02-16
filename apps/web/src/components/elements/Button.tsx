import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonProps {
  mode: "dark" | "light";
}

/** Generic styled HTML button alternative */
export const Button = (
  props: ButtonProps &
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
): JSX.Element => {
  const { mode, className, ...restprops } = props;

  if (mode === "dark") {
    return (
      <button
        className={`pointer-events-auto p-2 bg-light font-bold text-dark rounded-xl hover:ring-gray-500 hover:ring-2 disabled:hover:ring-0 disabled:bg-gray-500 ${className}`}
        {...restprops}
      />
    );
  } else {
    return (
      <button
        className={`pointer-events-auto p-2 bg-dark font-bold text-light rounded-xl hover:ring-gray-500 hover:ring-2 disabled:hover:ring-0 disabled:bg-gray-500 ${className}`}
        {...restprops}
      />
    );
  }
};
