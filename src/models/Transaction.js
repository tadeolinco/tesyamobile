class TransactionModel {
  name = 'Transaction';

  props = {
    description: 'string',
    amount: 'double',
    createdAt: 'datetime',
    budget: '#Budget',
  };
}

export default TransactionModel;
