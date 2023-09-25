'use strict';

/////////////////////////////////////////////////
//////////////////         //////////////////////
/////////////////  ATM APP  /////////////////////
/////////////////          //////////////////////
/////////////////////////////////////////////////
//-----------------------------------------------------Accounts
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-27T17:01:17.194Z',
    '2023-05-11T23:36:17.929Z',
    '2023-05-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Todor Stefanov',
  movements: [-200, -455.23, -306.5, 2500, 642.21, -133.9, 79.97, -1300],
  interestRate: 1.2,
  pin: 3333,

  movementsDates: [
    '2013-11-18T21:31:17.178Z',
    '2013-10-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-04-27T17:01:17.194Z',
    '2020-05-11T23:36:17.929Z',
    '2020-05-12T10:51:36.790Z',
  ],
  currency: 'BGN',
  locale: 'bg-BG',
};
const accounts = [account1, account2, account3];

//-------------------------------------------------------------- Elements from html
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
const body = document.querySelector('body');
//------------------------------------------------------------------------User Log

const startUp = function () {
  body.style.cssText =
    ' background-image: url(th.jpg);background-repeat: no-repeat;background-size: 100% 100%; overflow:hidden';
  const nav = document.querySelector('nav');
  nav.style.backgroundColor = '#f3f3f3';
};
startUp();
const userLog = function (user) {
  user.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
userLog(accounts);
//--------------------------------------------------------------Format for different currency
const format = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);

//---------------------------------------------------------------All function to update/refrresh UI
const updateUI = function (acc) {
  displayMovements(acc); //---from arrey movements
  currentBalance(acc); //---update label and add property to selected acount
  calcDisplSummery(acc); //--give values to labels under the form Movements
};
//---------------------------------------------------------------------------Date
const formatDate = function (date, locale) {
  const calcDays = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDays(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

//--------------------------------------------------------------------Display all movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  //----------------------------------------------Sort movements and attach date to each movement
  let movSort = [],
    index = [];
  if (sort) {
    index = Array.from(acc.movements.keys()).sort(
      (a, b) => acc.movements[a] - acc.movements[b]
    );

    movSort = index.slice().map(i => acc.movements[i]);
  } else {
    movSort = acc.movements;
    index = Array.from(acc.movements.keys());
  }
  movSort.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[index[i]]); //---------date

    const displayData = formatDate(date, acc.locale);
    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayData}</div>
          <div class="movements__value">${format(
            mov,
            acc.locale,
            acc.currency
          )}</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//------------------------------------------------------------------Display the  current balance
const currentBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, i) => acc + i, 0);
  labelBalance.textContent = ` ${format(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

//-------------------------------------------------------------------Display deposits income/outcome
const calcDisplSummery = function (acc) {
  const incomes = acc.movements
    .filter(i => i > 0)
    .reduce((acc, i) => acc + i, 0);
  labelSumIn.textContent = `${format(incomes, acc.locale, acc.currency)}`;
  const outcome = acc.movements
    .filter(i => i < 0)
    .reduce((acc, i) => acc + i, 0);
  labelSumOut.textContent = `${format(
    Math.abs(outcome),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter(i => i > 0)
    .map(i => i * (acc.interestRate / 100))
    .filter(i => {
      return i >= 1;
    })
    .reduce((acc, i) => acc + i, 0);
  labelSumInterest.textContent = `${format(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

let currentAcount = 'string';

//-------------------------------------------------------------------------------------Timer-Function
let timer;
const timerFN = function () {
  let time = 300;
  const timerSet = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = '0';
      labelWelcome.textContent = 'Your time expired! Please log in again.';
      startUp();
    }
    time--;
  };
  timerSet();
  timer = setInterval(timerSet, 1000);
};

//--------------------------------------------------------------------------------- Login button

btnLogin.addEventListener('click', function (e) {
  //----------------------------Prevent form from submiting
  e.preventDefault();
  currentAcount = accounts.find(
    acn => acn.userName === inputLoginUsername.value
  );
  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    //---------------------------------Clear input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    //---------------------------------Display UI and massage
    labelWelcome.textContent = `Welcome back, ${currentAcount.owner} `;
    containerApp.style.opacity = '1';
    body.style.backgroundImage = 'none';
    body.style.overflow = 'auto';
    //--------------------------------------------------------------------------------Date
    const now = new Date();
    const optionsHr = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      weekday: 'long',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcount.locale,
      optionsHr
    ).format(now);

    //----------------------------------------------------------------------Display movements,balance,income/outcome
    updateUI(currentAcount);
    clearInterval(timer);
    timerFN();
  } else {
    //-------------------------Wrong acount
    containerApp.style.opacity = '0';
    labelWelcome.textContent = 'Wrong acount! Try again!!!';
    startUp();
  }
});

//-----------------------------------Button transfer cesh
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recceverAcount = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  //---------------------------------Clear input fields
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();
  //-------------------------------Condition for btn
  if (
    amount > 0 &&
    recceverAcount &&
    amount < currentAcount.balance &&
    recceverAcount?.userName !== currentAcount.userName
  ) {
    setTimeout(function () {
      currentAcount.movements.push(-amount);
      currentAcount.movementsDates.push(new Date().toISOString());
      recceverAcount.movements.push(Math.abs(amount));
      recceverAcount.movementsDates.push(new Date().toISOString());
      updateUI(currentAcount);
    }, 4000);
  }
});

//-------------------------------------Button loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.round(inputLoanAmount.value);
  if (amount > 0 && currentAcount.movements.some(acc => acc >= amount * 0.1)) {
    setTimeout(function () {
      currentAcount.movements.push(amount);
      currentAcount.movementsDates.push(new Date().toISOString());
      updateUI(currentAcount);
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    }, 3000);
  }
});

//--------------------------------------Button for remove acount from arrey acounts
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const closeChosenAcountIndex = accounts.findIndex(
    accNum => accNum.userName === inputCloseUsername.value
  );
  const confirmPiN = accounts.find(
    acc => acc.pin === Number(inputClosePin.value)
  );

  //----------------------------------------Condition for button
  if (confirmPiN.userName == accounts[closeChosenAcountIndex].userName) {
    currentBalance(accounts[closeChosenAcountIndex]); //--------Check for money in the acount
    if (accounts[closeChosenAcountIndex].balance > 20) {
      alert`You have money in your acount.\n You can delete your acount if money are less then 20 EUR `;
    } else {
      if (accounts[closeChosenAcountIndex].userName == currentAcount.userName) {
        containerApp.style.opacity = '0';
        labelWelcome.textContent = 'Whrong acount! Try again!!!';
        // startUp();
      }
      accounts.splice(closeChosenAcountIndex, 1);
      inputCloseUsername.value = inputClosePin.value = '';
      inputCloseUsername.blur();
      inputClosePin.blur();
    }
  }
});

//-------------------------------------------------Button Sort
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAcount, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener('click', function () {
  const movElUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movElUI);
});

//-----------------FAke Log In---
// currentAcount = accounts[0];
// updateUI(currentAcount);
// containerApp.style.opacity = '1';
