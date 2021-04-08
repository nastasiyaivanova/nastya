// переменная для хранения состояния авторизованного пользователя
// при успешной авторизации должен содержать объект с пользовательскими данными
// при signOut должен становиться null
var authUserData = null;
var userDatabase = []; // массив с зарегистрированными пользователями

function validate(email, password) {
  if (!(/\S+@\S+\.\S+/.test(email) && typeof email === 'string')) {
    return { ok: false, message: 'Email entered incorrectly!' };
  }
  if (!password.match(/[a-z]/g)) {
    return { ok: false, message: 'Password must contain lowercase characters!' };
  }
  if (!password.match(/[A-Z]/g)) {
    return { ok: false, message: 'Password must contain uppercase characters!' };
  }
  if (!password.match(/[0-9]/g)) {
    return { ok: false, message: 'Password must contain numbers!' };
  }

  if (password.length < 6) {
    return { ok: false, message: 'The password must be longer than 8 characters!' };
  }
  return { ok: true, message: '' };
}

function register(email, password) {
  if (isAuth()) {
    return 'You are already signed in!';
  }
  // проверка на валидность email, пароля (6 символов, начинается с большой буквы, должен содержать как минимум 1 цифру)
  let res = validate(email, password);
  if (!res.ok) {
    return res.message;
  }
  // проверка нового пользователя в userDatabase
  let isUnique = true;
  userDatabase.forEach((userDatabaseItem) => {
    if (userDatabaseItem.email === email) {
      isUnique = false;
    }
  });
  if (isUnique) {
    userDatabase.push({ email, password });
    return 'Successful registration!';
  } else {
    return 'This user already exists!';
  }
}
function signIn(email, password) {
  // проверка на валидность email, пароля (6 символов, начинается с большой буквы)
  let res = validate(email, password);
  if (!res.ok) {
    return res.message;
  }
  // проверка наличия пользователя в userDatabase
  let isExist = false;
  let userData = {};
  userDatabase.forEach((userDatabaseItem) => {
    if (userDatabaseItem.email === email) {
      isExist = true;
      userData = userDatabaseItem;
    }
  });

  // заполнение authUserData
  if (isExist) {
    if (userData.email !== email && userData.password !== password) {
      return 'Incorrect email or password!';
    }
    authUserData = userData;
    return 'Successful authorization!';
  } else {
    return 'This user does not exist!';
  }
}

function signOut() {
  authUserData = null;
  return 'Successful signOut!';
}
function resetPassword(email, oldPassword, newPassword) {
  // функция восстановления пароля
  let res = validate(email, oldPassword);
  if (!res.ok) {
    return res.message;
  }
  // должна изменять пароль пользователя если старый пароль введен верно и новый пароль соответствует правилам формата пароля
  if (oldPassword !== newPassword) {
    userDatabase.map((userDatabaseItem) =>
      userDatabaseItem.email === email ? { ...userDatabaseItem, password: newPassword } : userDatabaseItem,
    );
    return 'Successful reset password!';
  }
  return 'Passwords match!';
}
function isAuth() {
  if (authUserData) {
    return true;
  }
  return false;
  // функция возвращает true если пользователь авторизован, false если нет
}
