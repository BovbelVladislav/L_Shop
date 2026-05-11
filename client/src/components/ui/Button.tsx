import React from 'react';

/**
 * @param {string} text
 * @param {function} onClick
 * @param {'primary' | 'secondary'} variant
 */
interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', type = "button" }) => {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick}>
      {text}
    </button>
  );
};