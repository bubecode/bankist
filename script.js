'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const accounts = [
  {
    owner: "Jonas Schmedtmann",
    username: "js",
    pin: 1111,
    movements: [200, 450.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    movementsDates: [
      "2024-11-10T14:11:59.604Z",
      "2024-12-15T17:01:17.194Z",
      "2025-01-05T23:36:17.929Z",
      "2025-01-25T10:51:36.790Z",
      "2025-02-01T08:41:26.394Z",
      "2025-02-10T13:15:33.035Z",
      "2025-02-13T09:48:16.867Z",
      "2025-02-14T06:04:23.907Z"
    ],
    currency: "EUR",
    locale: "pt-PT"
  },
  {
    owner: "Ahmed Salah",
    username: "as",
    pin: 2222,
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    movementsDates: [
      "2024-11-01T13:15:33.035Z",
      "2024-12-30T09:48:16.867Z",
      "2025-01-25T06:04:23.907Z",
      "2025-01-30T14:18:59.604Z",
      "2025-02-01T17:01:17.194Z",
      "2025-02-05T23:36:17.929Z",
      "2025-02-12T10:51:36.790Z",
      "2025-02-14T08:41:26.394Z"
    ],
    currency: "USD",
    locale: "en-US"
  }
];


const state = {
  currentUser: null,
  logoutTimer: null,
};

const formatCurrency = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);


const formatDate = (dateStr, locale) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(locale).format(date);
};

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
