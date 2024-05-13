export const MIN_PASSWORD_CHARS = 8;
export const MAX_PASSWORD_CHARS = 50;

export const isValidEmail = (text: string) => {
  const regex = /^\w+([.+-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,7})+$/;

  return text.match(regex);
};

export const isValidPassword = (text: string) => text.length >= MIN_PASSWORD_CHARS;
