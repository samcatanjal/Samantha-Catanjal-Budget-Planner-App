document.addEventListener("DOMContentLoaded", () => {

// Currency API //

const API_KEY = "b29d51a206cbecc9117b7f0f";

const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const convertAmount = document.getElementById("convert-amount");
const convertForm = document.getElementById("converter-form");
const convertResult = document.getElementById("result");

async function populateCurrencyDropdowns() {
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
    const data = await res.json();

    if (data.result !== "success") throw new Error("Failed to load currencies.");

    const currencyCodes = Object.keys(data.conversion_rates);

    currencyCodes.forEach((code) => { 
      const opt1 = document.createElement("option");
      opt1.value = code;
      opt1.textContent = code;
      fromCurrency.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = code;
      opt2.textContent = code;
      toCurrency.appendChild(opt2);
    });

    fromCurrency.value = "USD";
    toCurrency.value = "EUR";
  } catch (err) {
    console.error("Failed to load currency list", err);
    convertResult.textContent = "Could not load currency list.";
  }
}

convertForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(convertAmount.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (!amount || amount <= 0) {
    convertResult.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`);
    const data = await res.json();

    if (data.result !== "success" || !data.conversion_rates[to]) {
      throw new Error("Conversion error");
    }

    const rate = data.conversion_rates[to];
    const convertedAmount = rate * amount;

    const formattedAmount = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedConvertedAmount = convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    convertResult.textContent = `${formattedAmount} ${from} = ${formattedConvertedAmount} ${to}`;
  } catch (err) {
    console.error("Conversion failed", err);
    convertResult.textContent = "Conversion failed. Try again.";
  }
});


populateCurrencyDropdowns();

});

//////////////

document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://pocket-friendly-backend.onrender.com/api';
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  if (!token) {
    window.location.href = '/index.html';
    return;
  }

  // DOM Elements
  const list = document.getElementById('transaction-list');
  const incomeEl = document.getElementById('total-income');
  const expenseEl = document.getElementById('total-expense');
  const balanceEl = document.getElementById('balance');
  const form = document.getElementById('budget-form');
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const typeInput = document.getElementById('type');
  const logoutButton = document.querySelector('#header button');
  const currencySelect = document.getElementById('currency');
  const customCurrencyInput = document.getElementById('custom-currency');
  const welcomeMessage = document.getElementById('welcome-message');

  let latestTransactions = [];
  let currencySymbol = "$"; // Default

  welcomeMessage.textContent = `Welcome, ${email}`;

  // Currency Symbol
  function getCurrentCurrencySymbol() {
    const selected = currencySelect.value;
    if (selected === 'custom') {
      const val = customCurrencyInput.value.trim();
      return val || "$";
    }
    return selected;
  }

  currencySelect.addEventListener('change', () => {
    currencySymbol = getCurrentCurrencySymbol();
    updateUI(latestTransactions);
  });

  customCurrencyInput.addEventListener('input', () => {
    if (currencySelect.value === 'custom') {
      currencySymbol = customCurrencyInput.value.trim();
      updateUI(latestTransactions);
    }
  });

  // Logout
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/index.html';
  });

  // Fetch + Render Transactions
  async function fetchTransactions() {
    try {
      const res = await fetch(`${API}/transactions`, {
        headers: { Authorization: token }
      });
      const data = await res.json();
      latestTransactions = data;
      updateUI(data);
    } catch (err) {
      console.error('Error fetching transactions', err);
    }
  }

  // Format numbers with commas
  function formatNumber(num) {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(); // E.g., "6/5/2025, 3:45 PM"
  }

  function updateUI(transactions) {
    list.innerHTML = '';
    let income = 0, expense = 0;

    transactions.forEach(tx => {
      const div = document.createElement('div');
      div.className = `transaction ${tx.type}`;
      div.innerHTML = `
        <span>${tx.description}</span>
        <span>${currencySymbol}${formatNumber(tx.amount)}</span>
        <span class="timestamp">${formatDate(tx.createdAt || new Date())}</span>
        <span class="category-label">${tx.type === 'income' ? 'Income' : 'Expense'}</span>
        <button data-id="${tx._id}" style="cursor: pointer;">X</button>
      `;
      list.appendChild(div);

      if (tx.type === 'income') income += tx.amount;
      else expense += tx.amount;
    });

    incomeEl.textContent = `${currencySymbol}${formatNumber(income)}`;
    expenseEl.textContent = `${currencySymbol}${formatNumber(expense)}`;
    balanceEl.textContent = `${currencySymbol}${formatNumber(income - expense)}`;
  }

  // Add Transaction
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!description || isNaN(amount)) {
      alert("Please fill out both fields correctly.");
      return;
    }

    try {
      await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify({ description, amount, type })
      });

      form.reset();
      fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction', err);
    }
  });

  // Delete Transaction
  list.addEventListener('click', async (e) => {
    if (e.target.tagName === 'BUTTON') {
      const id = e.target.getAttribute('data-id');
      try {
        await fetch(`${API}/transactions/${id}`, {
          method: 'DELETE',
          headers: { Authorization: token }
        });
        fetchTransactions();
      } catch (err) {
        console.error('Error deleting transaction', err);
      }
    }
  });

  // Initial fetch
  currencySymbol = getCurrentCurrencySymbol();
  fetchTransactions();
});
