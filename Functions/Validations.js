export const validateEmail = (email) => {
  return /\w{3,}@\w{3,}\.\w+/i.test(email);
};
export const validatePassword = (password) => {
  return /\w{6,}/i.test(password);
};
