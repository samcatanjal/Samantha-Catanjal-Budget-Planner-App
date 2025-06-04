const budgetForm = document.getElementById('budget-form');

if (budgetForm) {
  budgetForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login again.');
      window.location.href = '/index.html';
      return;
    }

    try {
      const res = await fetch('https://pocket-friendly-backend.onrender.com/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description, amount, type }),
      });

      if (!res.ok) throw new Error('Failed to add transaction');

      // Optionally reload user data or append transaction to list
      // For simplicity, reload page or re-fetch user data
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to add transaction');
    }
  });
}

// Currency API //

const API_KEY = "43daa10f295491ccbdb64fa7";

const fromCurrency1 = document.getElementById("from-currency-1");
const toCurrency1 = document.getElementById("to-currency-1");
const convertAmount1 = document.getElementById("amount-1");
const converterForm1 = document.getElementById("converter-form-1");
const conversionResult1 = document.getElementById("result-1");

async function populateCurrencyDropdowns() {
  try {
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/codes`);
    const data = await res.json();

    if (!data.supported_codes) throw new Error("Currency list not available");

    const currencies = data.supported_codes;

    currencies.forEach(([code]) => {
      const opt1 = document.createElement("option");
      opt1.value = code;
      opt1.textContent = code;
      fromCurrency1.appendChild(opt1);

      const opt2 = document.createElement("option");
      opt2.value = code;
      opt2.textContent = code;
      toCurrency1.appendChild(opt2);
    });

    fromCurrency1.value = "AED";
    toCurrency1.value = "PHP";
  } catch (err) {
    console.error("Failed to load currency list", err);
    conversionResult1.textContent = "Failed to load currency list.";
  }
}

converterForm1.addEventListener("submit", async (e) => {
  e.preventDefault();

  const amount = parseFloat(convertAmount1.value);
  const from = fromCurrency1.value;
  const to = toCurrency1.value;

  if (!amount || amount <= 0) {
    conversionResult1.textContent = "Please enter a valid amount.";
    return;
  }

  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`
    );
    const data = await res.json();

    if (data.result === "error") throw new Error("Conversion error");

    const result = data.conversion_result;
    conversionResult1.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
  } catch (err) {
    console.error("Conversion failed", err);
    conversionResult1.textContent = "Conversion failed. Try again.";
  }
});

populateCurrencyDropdowns();


// Logout //

const logoutBtn = document.querySelector('#header button');

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.href = '/index.html';
  });
}