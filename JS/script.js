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


