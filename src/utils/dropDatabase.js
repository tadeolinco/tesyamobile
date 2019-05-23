function dropDatabase({ Budget, Transaction, Cash }) {
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
  Cash.onLoaded(() => {
    Cash.data().forEach(({ id }) => {
      Cash.remove(id);
    });
  });
}

export default dropDatabase;
