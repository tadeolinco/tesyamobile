function dropDatabase({ Budget, Transaction, Income }) {
  Budget.onLoaded(() => {
    Budget.data().forEach(({ id }) => {
      Budget.remove(id);
    });
  });
  Transaction.onLoaded(() => {
    Transaction.data().forEach(({ id }) => {
      Transaction.remove(id);
    });
  });
  Income.onLoaded(() => {
    Income.data().forEach(({ id }) => {
      Income.remove(id);
    });
  });
}

export default dropDatabase;
