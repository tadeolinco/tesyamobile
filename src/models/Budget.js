class BudgetModel {
  name = 'Budget';

  props = {
    name: 'string',
    frequency: 'string',
    allocated: 'double',
    transactions: '[]#Transaction',
    createdAt: 'datetime',
  };
}

export default BudgetModel;
