import React, { useContext } from 'react';
import { View } from 'react-native';
import BudgetItem from '../components/BudgetItem';
import Statistic from '../components/Statistic';
import DBContext from '../context/DBContext';

function HomeScreen() {
  const { budgets, totalExpenses, totalCash, cash } = useContext(DBContext);

  return (
    <View>
      {[...budgets]
        .sort((a, b) => {
          if (a.frequency === b.frequency) return 0;
          if (a.frequency === 'D') return -1;
          if (b.frequency === 'D') return 1;

          return a.name > b.name ? -1 : a.name < b.name ? 1 : 0;
        })
        .map(budget => (
          <BudgetItem key={budget.id} {...budget} />
        ))}

      <Statistic
        label="Total Cash:"
        value={totalCash}
        style={{ marginTop: 20 }}
      />
      <Statistic label="Total Expenses:" value={-totalExpenses} />
      <Statistic label="Saving:" value={cash.amount - totalExpenses} />
    </View>
  );
}

export default HomeScreen;
