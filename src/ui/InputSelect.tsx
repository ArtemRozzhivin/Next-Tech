import React from 'react';
import Input from './Input';

interface IInputSelect {
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  options: any[];
  optionExtractor?: (option: any) => string;
  onOptionClick: (option: any) => void;
}

const InputSelect = ({
  name,
  label,
  value,
  onChange,
  placeholder,
  options,
  optionExtractor,
  onOptionClick,
}: IInputSelect) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleOptionClick = (option: string) => {
    onOptionClick(option);
    setIsFocused(false);
  };

  return (
    <div className='relative'>
      <Input
        name={name}
        type='text'
        label={label}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {options?.length > 0 && isFocused && (
        <div className='rounded-md bg-red-600 absolute w-full -bottom-11 left-0 p-2'>
          {options?.map((option) => (
            <button key={option} onClick={() => handleOptionClick(option)}>
              {optionExtractor ? optionExtractor(option) : option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputSelect;
