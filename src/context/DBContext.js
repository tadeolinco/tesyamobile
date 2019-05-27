import {
  differenceInDays,
  differenceInMonths,
  getDaysInMonth,
  isThisMonth,
} from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import Vasern from 'vasern';
import BudgetModel from '../models/Budget';
import IncomeModel from '../models/Income';
import TransactionModel from '../models/Transaction';

export const DBContext = React.createContext(null);

export function DBProvider({ children }) {
  const [db, setDB] = useState(null);

  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const vasern = new Vasern({
      schemas: [BudgetModel, IncomeModel, TransactionModel],
      version: 3,
    });

    const { Budget, Transaction, Income } = vasern;

    Budget.onLoaded(() => {
      Transaction.onLoaded(() => {
        Income.onLoaded(() => {
          setBudgets(Budget.data());
          setTransactions(Transaction.data());
          let dbIncome = Income.data()[0];
          if (!dbIncome) {
            dbIncome = Income.insert({
              amount: 0,
            })[0];
          }
          setIncome(dbIncome);
          setDB(vasern);
        });
      });
    });

    Budget.onChange(({ event, changed }) => {
      const budget = changed ? changed[0] : {};

      if (event === 'insert') {
        setBudgets(budgets => [...budgets, budget]);
      } else if (event === 'update') {
        setBudgets(budgets =>
          budgets.map(b => (b.id === budget.id ? budget : b))
        );
      } else if (event === 'remove') {
        let dbTransactions = Transaction.filter({ budget: budget.id }).data();
        for (const transaction of dbTransactions) {
          Transaction.remove(transaction.id);
        }
        dbTransactions = Transaction.filter({ budget_id: budget.id }).data();
        for (const transaction of dbTransactions) {
          Transaction.remove(transaction.id);
        }
        setBudgets(budgets => budgets.filter(b => b.id !== budget.id));
      }
    });

    Transaction.onChange(({ event, changed }) => {
      const transaction = changed ? changed[0] : {};
      if (event === 'insert') {
        setTransactions(transactions => [...transactions, transaction]);
      } else if (event === 'update') {
        setTransactions(transactions =>
          transactions.map(t => (t.id === transaction.id ? transaction : t))
        );
      } else if (event === 'remove') {
        setTransactions(transactions =>
          transactions.filter(t => t.id !== transaction.id)
        );
      }
    });

    Income.onChange(({ event, changed }) => {
      const income = changed ? changed[0] : {};
      if (event === 'update') {
        setIncome(income);
      }
    });
  }, []);

  const now = new Date();
  const budgetsMeta = useMemo(() => {
    const newBudgetsMeta = {};

    for (const budget of budgets) {
      const multiplier =
        budget.frequency === 'D' ? differenceInDays : differenceInMonths;
      const extra =
        (multiplier(new Date(), new Date(budget.createdAt)) + 1) *
        budget.allocated;

      newBudgetsMeta[budget.id] = {
        transactions: [],
        budget,
        extra,
      };
    }
    for (const transaction of transactions) {
      const id = transaction.budget_id || transaction.budget;

      if (newBudgetsMeta[id]) {
        newBudgetsMeta[id].transactions.push(transaction);
        newBudgetsMeta[id].extra -= transaction.amount;
      }
    }

    return newBudgetsMeta;
  }, [budgets, transactions, now.getDate(), now.getMonth(), now.getFullYear()]);

  const estimateExpenses = useMemo(() => {
    let estimateExpenses = 0;

    for (const budget of budgets) {
      if (budget.frequency === 'D') {
        estimateExpenses -= getDaysInMonth(new Date()) * budget.allocated;
      } else {
        estimateExpenses -= budget.allocated;
      }
    }
    return estimateExpenses;
  }, [budgets]);

  const totalExpenses = useMemo(() => {
    let totalExpenses = 0;

    const transactionsThisMonth = transactions.filter(transaction =>
      isThisMonth(new Date(transaction.createdAt))
    );

    for (const transaction of transactionsThisMonth) {
      totalExpenses -= transaction.amount;
    }

    return totalExpenses;
  }, [transactions]);

  return (
    <DBContext.Provider
      value={{
        db,
        budgets,
        income,
        transactions,
        budgetsMeta,
        estimateExpenses,
        totalExpenses,
      }}
    >
      {children}
    </DBContext.Provider>
  );
}

export default DBContext;
