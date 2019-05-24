import React, { useContext } from 'react';
import { View } from 'react-native';
import BudgetItem from '../components/BudgetItem';
import Statistic from '../components/Statistic';
import DBContext from '../context/DBContext';

function HomeScreen() {
  const {
    budgets,
    cash,
    budgetsMeta,
    estimateExpenses,
    totalExpenses,
  } = useContext(DBContext);

  return (
    <View>
      {[...budgets]
        .sort((a, b) => {
          if (a.frequency === b.frequency)
            return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
          if (a.frequency === 'D') return -1;
          if (b.frequency === 'D') return 1;
          return 0;
        })
        .map(budget => (
          <BudgetItem key={budget.id} {...budget} {...budgetsMeta[budget.id]} />
        ))}

      {cash && (
        <Statistic
          label="Total Cash:"
          value={cash.amount}
          style={{ marginTop: !budgets.length ? 0 : 20 }}
        />
      )}
      <Statistic label="Estimate Expenses:" value={estimateExpenses} />
      <Statistic label={`Total Expenses:`} value={totalExpenses} />
    </View>
  );
}

export default HomeScreen;
