const btn = document.getElementById("donate-btn");
const input = document.getElementById("donation-amount");

// Format raw cents into $X.XX
const formatUSD = (rawCents) => {
  const number = Number(rawCents);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(number / 100);
};

// Handle typing → auto-format as dollars
input.addEventListener("input", () => {
  const digits = input.value.replace(/[^\d]/g, ""); // keep only numbers

  if (!digits) {
    input.value = "";
    return;
  }

  input.value = formatUSD(digits);
});

// Handle donation button click
btn.addEventListener("click", async () => {
  // Remove formatting → get numeric dollars
  const numeric = Number(input.value.replace(/[^0-9.]/g, ""));

  input.classList.remove("is-invalid");

  if (!numeric || numeric < 1) {
    input.classList.add("is-invalid");
    return;
  }

  const amountInCents = Math.round(numeric * 100);

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [
        {
          id: "donation",
          amount: amountInCents
        }
      ]
    })
  });

  const data = await res.json();

  if (data.url) {
    window.location = data.url;
  } else {
    let message = "Checkout failed.";

    if (data.error === "amount_too_small") {
      message = "Your donation must be at least $1.";
      input.classList.add("is-invalid");
    } else if (data.error) {
      message = "Checkout failed: " + data.error;
    }

    alert(message);
  }
});

// Remove validation error when user edits
input.addEventListener("input", () => {
  input.classList.remove("is-invalid");
});
