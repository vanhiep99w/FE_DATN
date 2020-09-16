export const email = (value) => {
  const regularEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return !regularEmail.test(value) ? "Invalid email address" : undefined;
};

export const require = (value) => {
  return !value ? "Field can't empty" : undefined;
};

const minLength = (min) => (value) =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const maxLength = (max) => (value) =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;

export const minLength6 = minLength(6);
export const maxLength15 = maxLength(15);