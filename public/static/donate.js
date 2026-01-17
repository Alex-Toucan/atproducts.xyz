const btn = document.getElementById("donate-btn");
const input = document.getElementById("donation-amount");
const feedback = input.nextElementSibling;

const formatUSD = (rawCents) => {
  const number = Number(rawCents);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(number / 100);
};

input.addEventListener("input", () => {
  const digits = input.value.replace(/[^\d]/g, "");

  if (!digits) {
    input.value = "";
    return;
  }

  input.value = formatUSD(digits);
  input.classList.remove("is-invalid");
});

btn.addEventListener("click", async () => {
  const numeric = Number(input.value.replace(/[^0-9.]/g, ""));

  input.classList.remove("is-invalid");

  if (!numeric || numeric < 1) {
    feedback.textContent = "Please enter a valid amount of at least $1.";
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
    return;
  }

  if (data.error === "amount_too_small") {
    feedback.textContent = "Your donation must be at least $1.";
    input.classList.add("is-invalid");
  } else if (data.error) {
    feedback.textContent = "Checkout failed: " + data.error;
    input.classList.add("is-invalid");
  }
});
