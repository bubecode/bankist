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

const app = document.querySelector('.app');
const movementsContainer = document.querySelector('.movements');

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


// STEP 1 — Create a helper function to find a user by username
const findAccount = username => accounts.find(acc => acc.username === username)


let currentAccount;

// STEP 2 — Add login event listener

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value
  const pin = Number(inputLoginPin.value)
  if (!username) return

  currentAccount = findAccount(username)

  if (currentAccount?.pin === pin) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`
    state.currentUser = currentAccount

    app.style.opacity = 1

    inputLoginUsername.value = inputLoginPin.value = ""
    inputLoginPin.blur()
    updateUI(currentAccount)

  }

})


function displayMovements(account) {
  // 1. clear container
  movementsContainer.innerHTML = "";
  // 2. loop through movements
  const movements = account.movements
  movements.forEach(function (value, i) {
    // 3. determine type: deposit or withdrawal
    const type = value > 0 ? "deposit" : "withdrawal"

    // 4. format the value
    const formatted = formatCurrency(value, account.locale, account.currency)
    const date = formatDate(account.movementsDates[i], account.locale)


    // 5. generate HTML

    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">
              ${i + 1} ${type}
            </div>
            <div class="movements__date">${date}</div>
            <div class="movements__value">${formatted}</div>
          </div>
        `;

    // 6. insert HTML into the container
    movementsContainer.insertAdjacentHTML("afterbegin", html);




  })

}

function calcDisplayBalance(account) {
  // 1. calculate balance
  const totalAmount = account.movements.reduce((acc, curr) => acc + curr, 0)
  const format_amount = formatCurrency(totalAmount, account.locale, account.currency)

  // 2. set account.balance
  account.balance = totalAmount;  // 3. update labelBalance.textContent
  labelBalance.textContent = format_amount
}


function calcDisplaySummary(account) {
  // 1. calculate incomes
  const income = account.movements.filter(acc => acc > 0).reduce((acc, curr) => acc + curr, 0)

  // 2. calculate out (absolute values)
  const out = Math.abs(account.movements.filter(acc => acc < 0).reduce((acc, curr) => acc + curr, 0))

  // 3. calculate interest (only on deposits)
  const interest = account.movements.filter(acc => acc > 0).map(deposit => (deposit * account.interestRate) / 100).filter(int => int >= 1).reduce((acc, cur) => acc + cur, 0)

  // 4. update labelSummaryIn
  labelSumIn.textContent = formatCurrency(income, account.locale, account.currency)
  // 5. update labelSummaryOut
  labelSumOut.textContent = formatCurrency(out, account.locale, account.currency)
  // 6. update labelSummaryInterest
  labelSumInterest.textContent = formatCurrency(interest, account.locale, account.currency)
}

// STEP 3 — UI update function
function updateUI(account) {
  displayMovements(account)
  calcDisplayBalance(account)
  calcDisplaySummary(account)
}

// STEP 4 — PART A: Transfer event listener skeleton
btnTransfer.addEventListener("click", function (e) {

  e.preventDefault();

  // 1. read amount and receiver username
  const amount = Number(inputTransferAmount.value)

  // 2. find receiver account
  const receiverAcc = findAccount(inputTransferTo.value)
  // 3. validate:
  //    - amount > 0
  //    - receiver exists
  //    - receiver !== current user
  //    - currentUser.balance >= amount
  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== state.username
  ) {
    // 4. transfer logic:
    //    - subtract from currentUser.movements
    currentAccount.movements.push(-amount)
    //    - add to receiver.movements
    receiverAcc.movements.push(amount)
    //    - add dates to both accounts
    state.currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // 5. updateUI(state.currentUser)

    updateUI(state.currentUser)
    // 6. Clear fields
    inputTransferAmount.value = inputTransferTo.value = "";
    inputTransferAmount.blur();
  }
})
