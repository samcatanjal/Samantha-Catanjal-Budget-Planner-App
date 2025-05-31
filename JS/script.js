const form = document.getElementById("budget-form");
const list = document.getElementById("transaction-list");
const totalIncome = document.getElementById("total-income");
const totalExpense = document.getElementById("total-expense");
const balance = document.getElementById("balance");

const user = JSON.parse(localStorage.getItem("loggedInUser"));
const token = localStorage.getItem("token");
document.getElementById("welcome-message").textContent = `Welcome, ${user.email}`;

let transactions = [];
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

async function fetchTransactions() {
  try {
    const res = await fetch("https://pocket-friendly-backend.onrender.com/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    transactions = data;
    updateUI();
  } catch (err) {
    console.error("Failed to load transactions", err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value;
  const amount = document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const date = new Date().toLocaleDateString();

  try {
    const res = await fetch("https://pocket-friendly-backend.onrender.com/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description, amount, type, date }),
    });

    if (res.ok) {
      await fetchTransactions();
      form.reset();
    } else {
      alert("Failed to add transaction");
    }
  } catch (err) {
    console.error("Submit error", err);
  }
});

async function deleteTransaction(index) {
  try {
    const res = await fetch(`https://pocket-friendly-backend.onrender.com/api/transactions/${index}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      await fetchTransactions();
    } else {
      alert("Failed to delete transaction");
    }
  } catch (err) {
    console.error("Delete error", err);
  }
}

fetchTransactions();
