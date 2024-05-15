import * as yup from 'yup';

const nameRegExp = /^[a-zA-Zа-яА-ЯіІїЇєЄ' -]+$/;
const cardNumberRegExp = /^(\d{4} ){3}\d{4}$/;
const cardExpirationRegExp = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/; // Регулярний вираз для формату "MM/YY"
const cardCVVRegExp = /^[0-9]{3,4}$/;

export const validation = (cardType: string, paymentType: string) => {
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

    cardNumber:
      paymentType === 'card-payment'
        ? yup
            .string()
            .required('Номер карти є обовязковим')
            .matches(cardNumberRegExp, 'Номер карти повинен бути у форматі **** **** **** ****')
        : yup.string().notRequired(),
    cardExpiration:
      paymentType === 'card-payment'
        ? yup
            .string()
            .required('Термін дії карти є обовязковим')
            .matches(cardExpirationRegExp, 'Невірний формат')
        : yup.string().notRequired(),
    cardCVV:
      paymentType === 'card-payment'
        ? yup
            .string()
            .required('CVV код є обовязковим')
            .matches(cardCVVRegExp, 'CVV код повинен містити 3 або 4 цифри')
        : yup.string().notRequired(),
  });

  return shcema;
};
