import { MuiTelInput, MuiTelInputContinent } from 'mui-tel-input';
import { InputLabel } from '@mui/material';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface IInputPhone {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label: string;
  error?: any;
  placeholder?: string | undefined;
}

export const InputPhone = ({
  value,
  onChange,
  name,
  label,
  placeholder,
  error,
}: IInputPhone): JSX.Element => {
  // const { control } = useFormContext();
  const continents: MuiTelInputContinent[] = ['EU'];

  return (
    <div className='relative'>
      <div>
        <InputLabel>{label}</InputLabel>
        <MuiTelInput
          className='w-full'
          name={name}
          defaultCountry='UA'
          value={value}
          onChange={onChange}
          continents={continents}
          placeholder={placeholder}
        />
      </div>

      {error && (
        <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
          <ExclamationCircleIcon className='h-5 w-5 text-red-500' aria-hidden />
        </div>
      )}
      {error && (
        <p className='mt-2 text-sm text-red-600' id='email-error'>
          {error}
        </p>
      )}
    </div>
  );
};
