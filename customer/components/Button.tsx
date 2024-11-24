import React from "react";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  name: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  name = "",
}) => {
  return (
    <button
      className={`inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow-md hover:bg-blue-600  ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name}
    </button>
  );
};

export default Button;
