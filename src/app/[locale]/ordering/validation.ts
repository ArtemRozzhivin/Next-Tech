import * as yup from 'yup';

const nameRegExp = /^[a-zA-Zа-яА-ЯіІїЇєЄ' -]+$/;

export const validation = (cardType: string) => {
  let shcema = yup.object().shape({
    firstName: yup
      .string()
      .required('First name is required')
      .matches(
        nameRegExp,
        'First name should contain only letters, spaces, hyphens, and apostrophes',
      ),
    lastName: yup
      .string()
      .required('Last name is required')
      .matches(
        nameRegExp,
        'Last name should contain only letters, spaces, hyphens, and apostrophes',
      ),
    patronymic: yup
      .string()
      .required('Patronymic name is required')
      .matches(
        nameRegExp,
        'Patronymic should contain only letters, spaces, hyphens, and apostrophes',
      ),
    phone: yup.string().required('Phone number is required'),
    house:
      cardType === 'courier'
        ? yup.string().required('House is required')
        : yup.string().notRequired(),
    flat:
      cardType === 'courier'
        ? yup.string().required('Flat is required')
        : yup.string().notRequired(),
    city: yup.string().required('City is required'),
    adress:
      cardType === 'courier'
        ? yup.string().required('Adress is required')
        : yup.string().notRequired(),
    officeAdress:
      cardType === 'office'
        ? yup.string().required('Office adress is required')
        : yup.string().notRequired(),
  });

  return shcema;
};
