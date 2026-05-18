import React from 'react';

/**
 * @param {string} label 
 * @param {string} type 
 */
interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const Input: React.FC<InputProps> = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};