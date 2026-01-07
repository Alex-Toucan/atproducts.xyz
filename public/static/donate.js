const btn = document.getElementById("donate-btn");
    const input = document.getElementById("donation-amount");

    btn.addEventListener("click", async () => {
      const amount = Number(input.value);

      // Reset validation state
      input.classList.remove("is-invalid");

      if (!amount || amount < 1) {
        input.classList.add("is-invalid");
        return;
      }

      const amountInCents = Math.round(amount * 100);

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
        // Show specific error messages
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

    // Remove validation error when user edits the field
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });