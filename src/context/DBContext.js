import {
  differenceInDays,
  differenceInMonths,
  getDaysInMonth,
  isThisMonth,
} from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import Vasern from 'vasern';
import BudgetModel from '../models/Budget';
import CashModel from '../models/Cash';
import TransactionModel from '../models/Transaction';

export const DBContext = React.createContext(null);

export function DBProvider({ children }) {
  const [db, setDB] = useState(null);

  const [budgets, setBudgets] = useState([]);
  const [cash, setCash] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const vasern = new Vasern({
      schemas: [BudgetModel, CashModel, TransactionModel],
      version: 3,
    });

    const { Budget, Transaction, Cash } = vasern;

    Budget.onLoaded(() => {
      Transaction.onLoaded(() => {
        Cash.onLoaded(() => {
          setBudgets(Budget.data());
          setTransactions(Transaction.data());
          let dbCash = Cash.data()[0];
          if (!dbCash) {
            dbCash = Cash.insert({
              amount: 0,
            });
          }
          setCash(dbCash);
          setDB(vasern);
        });
      });
    });

    Budget.onChange(({ event, changed }) => {
      if (event === 'insert') {
        setBudgets(budgets => [...budgets, budget]);
      } else if (event === 'update') {
        setBudgets(budgets =>
          budgets.map(b => (b.id === budget.id ? budget : b))
        );
      } else if (event === 'remove') {
        setBudgets(budget => budgets.filter(b => b.id !== budget.id));
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

    Cash.onChange(({ event, changed }) => {
      const cash = changed ? changed[0] : {};
      if (event === 'update') {
        setCash(cash);
      }
    });
  }, []);

  const budgetsMeta = useMemo(() => {
    const budgetsMeta = {};

    for (const budget of budgets) {
      const multiplier =
        budget.frequency === 'D' ? differenceInDays : differenceInMonths;
      const extra =
        (multiplier(new Date(), new Date(budget.createdAt)) + 1) *
        budget.allocated;

      budgetsMeta[budget.id] = {
        transactions: [],
        budget,
        extra,
      };
    }

    for (const transaction of transactions) {
      const id = transaction.budget_id || transaction.budget;

      budgetsMeta[id].transactions.push(transaction);
      budgetsMeta[id].extra -= transaction.amount;
    }

    return budgetsMeta;
  }, [budgets, transactions]);

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
        cash,
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
