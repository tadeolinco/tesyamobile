import React, { useContext } from 'react';
import { ScrollView } from 'react-native';
import BudgetItem from '../components/BudgetItem';
import Statistic from '../components/Statistic';
import DBContext from '../context/DBContext';

function HomeScreen() {
  const {
    budgets,
    budgetsMeta,
    estimateExpenses,
    totalExpenses,
    income,
  } = useContext(DBContext);

  return (
    <ScrollView>
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

      <Statistic
        style={{ marginTop: !budgets.length ? 0 : 20 }}
        label="Monthly Expenses:"
        value={estimateExpenses}
      />
      <Statistic label="Current Expenses:" value={totalExpenses} />
      {income && (
        <Statistic
          label="Monthly Savings:"
          value={income.amount + estimateExpenses}
        />
      )}
    </ScrollView>
  );
}

export default HomeScreen;
