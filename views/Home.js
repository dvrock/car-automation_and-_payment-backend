
document.addEventListener("DOMContentLoaded", async () => {
  const stripe = Stripe(
    "pk_test_51KNEi6LdRkVXjaBCP8mP2KeKINQ1R6klEr6NwgSY7KaMGQAZpK0svLL3Nmjf6NTd4kfrd77za19lHXT3YNBE7Q0300MvzhKvr5"
  );
  const elements = stripe.elements();
  const cardElement = elements.create("card");
  cardElement.mount("#card-element");
  console.log("card");
});
