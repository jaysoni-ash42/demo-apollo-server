export const registerValidator = (
  userName,
  password,
  confirmPassword,
  email
) => {
  const errors = {};
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (userName.trim() === "") {
    errors.userName = "userName must not be null";
  }
  if (password.trim() === "") {
    errors.password = "password must not be null";
  }
  if (confirmPassword != password) {
    errors.confirmPassword = "confirmPassword must be same as password";
  }
  if (email.trim() === "") {
    errors.email = "email must not be null";
  }
  if (!email.match(emailRegex)) {
    errors.email = "Not a valid email";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const loginValidator = (userName, password) => {
  const errors = {};

  if (userName.trim() === "") {
    errors.userName = "userName must not be null";
  }
  if (password.trim() === "") {
    errors.password = "password must not be null";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
