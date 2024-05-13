import * as yup from 'yup';

const nameRegExp = /^[a-zA-Zа-яА-ЯіІїЇєЄ' -]+$/;

export const validation = (cardType: string) => {
  const shcema = yup.object().shape({
    firstName: yup
      .string()
      .required("Ім'я є обов'язковим")
      .matches(nameRegExp, "Ім'я повинно містити тільки літери, пробіли, дефіси та апострофи"),
    lastName: yup
      .string()
      .required("Прізвище є обов'язковим")
      .matches(nameRegExp, 'Прізвище повинно містити тільки літери, пробіли, дефіси та апострофи'),
    patronymic: yup
      .string()
      .required("Ім'я по батькові обов'язкове")
      .matches(
        nameRegExp,
        "Ім'я по батькові повинно містити тільки літери, пробіли, дефіси та апострофи",
      ),
    phone: yup.string().required('Номер телефону є обовязковим'),
    house:
      cardType === 'courier'
        ? yup.string().required('Номер будинку є обовязковим')
        : yup.string().notRequired(),
    flat: cardType === 'courier' ? yup.string().notRequired() : yup.string().notRequired(),
    city: yup.string().required("Місто є обов'язковим"),
    adress:
      cardType === 'courier'
        ? yup.string().required("Адреса є обов'язковою")
        : yup.string().notRequired(),
    officeAdress:
      cardType === 'office'
        ? yup.string().required("Адреса відділення є обов'язковою")
        : yup.string().notRequired(),
  });

  return shcema;
};
