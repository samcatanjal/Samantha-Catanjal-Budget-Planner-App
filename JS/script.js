const form = document.getElementById("budget-form");
const list = document.getElementById("transaction-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");

const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
const storageKey = `transactions_${currentUser?.email}`;
document.getElementById("welcome-message").textContent = `Welcome, ${currentUser.email}`;

let transactions = JSON.parse(localStorage.getItem(storageKey)) || [];

let currencySymbol = localStorage.getItem("currencySymbol") || "$";
const currencySelect = document.getElementById("currency");
const customCurrencyInput = document.getElementById("custom-currency");

if (currencySymbol.length > 1 || !["$", "£", "€", "₹", "¥"].includes(currencySymbol)) {
  currencySelect.value = "custom";
  customCurrencyInput.style.display = "block";
  customCurrencyInput.value = currencySymbol;
} else {
  currencySelect.value = currencySymbol;
}

currencySelect.addEventListener("change", (e) => {
  const value = e.target.value;
  if (value === "custom") {
    customCurrencyInput.style.display = "block";
    customCurrencyInput.focus();
  } else {
    customCurrencyInput.style.display = "none";
    currencySymbol = value;
    localStorage.setItem("currencySymbol", currencySymbol);
    updateUI();
  }
});

customCurrencyInput.addEventListener("input", (e) => {
  currencySymbol = e.target.value || "$";
  localStorage.setItem("currencySymbol", currencySymbol);
  updateUI();
});

function updateUI() {
  list.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.classList.add(t.type);
    li.innerHTML = `
      ${t.description} (${t.date}) <strong>${currencySymbol}${t.amount}</strong>
      <button onclick="deleteTransaction(${index})">X</button>
    `;
    list.appendChild(li);
    if (t.type === "income") income += parseFloat(t.amount);
    else expense += parseFloat(t.amount);
  });

  totalIncome.textContent = currencySymbol + income.toFixed(2);
  totalExpense.textContent = currencySymbol + expense.toFixed(2);
  balance.textContent = currencySymbol + (income - expense).toFixed(2);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const date = new Date().toLocaleDateString();

  transactions.push({ description, amount, type, date });
  localStorage.setItem(storageKey, JSON.stringify(transactions));
  form.reset();
  updateUI();
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  localStorage.setItem(storageKey, JSON.stringify(transactions));
  updateUI();
}

updateUI();