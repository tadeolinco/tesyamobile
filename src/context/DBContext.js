import { differenceInDays, differenceInMonths, getDaysInMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Vasern from 'vasern';
import BudgetModel from '../models/Budget';
import CashModel from '../models/Cash';
import TransactionModel from '../models/Transaction';
// import dropDatabase from '../utils/dropDatabase';

export const DBContext = React.createContext(null);

export function DBProvider({ children }) {
  const [db, setDB] = useState(null);

  const [budgets, setBudgets] = useState([]);
  const [cash, setCash] = useState(null);
  const [totalCash, setTotalCash] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    let newTotalExpenses = 0;
    for (const budget of budgets) {
      if (budget.frequency === 'D') {
        newTotalExpenses += getDaysInMonth(new Date()) * budget.allocated;
      } else {
        newTotalExpenses += budget.allocated;
      }
    }
    setTotalExpenses(newTotalExpenses);
  }, [budgets]);

  useEffect(() => {
    const vasern = new Vasern({
      schemas: [BudgetModel, CashModel, TransactionModel],
      version: 3,
    });

    const { Budget, Transaction, Cash } = vasern;

    Cash.onLoaded(() => {
      const dbCash = Cash.data()[0];
      if (!dbCash) {
        Cash.insert({
          amount: 0,
        });
      } else {
        setCash(dbCash);
      }
    });

    Cash.onChange(({ event, changed }) => {
      if (['insert', 'update'].includes(event)) {
        setCash(changed[0]);
      }
    });

    Budget.onLoaded(() => {
      Transaction.onLoaded(() => {
        Cash.onLoaded(() => {
          setDB(vasern);
        });
      });
    });

    Budget.onLoaded(() => {
      Transaction.onLoaded(() => {
        Cash.onLoaded(() => {
          const dbCash = Cash.data()[0];

          let computedTotalCash = dbCash ? dbCash.amount : 0;

          const budgets = [...Budget.data()];
          for (const budget of budgets) {
            const multiplier =
              budget.frequency === 'D' ? differenceInDays : differenceInMonths;
            let extra =
              (multiplier(new Date(), new Date(budget.createdAt)) + 1) *
              budget.allocated;

            Transaction.filter({
              budget_id: budget.id,
            })
              .data()
              .forEach(transaction => {
                computedTotalCash -= transaction.amount;
                extra -= transaction.amount;
              });
            budget.extra = extra;
          }
          setTotalCash(computedTotalCash);
          setBudgets(budgets);
        });
      });
    });

    Budget.onChange(({ event, changed }) => {
      if (event === 'update') {
        let computedTotalCash = totalCash;
        const budget = changed[0];
        const multiplier =
          budget.frequency === 'D' ? differenceInDays : differenceInMonths;
        let extra =
          (multiplier(new Date(), new Date(budget.createdAt)) + 1) *
          budget.allocated;

        Transaction.filter({
          budget_id: budget.id,
        })
          .data()
          .forEach(transaction => {
            computedTotalCash -= transaction.amount;
            extra -= transaction.amount;
          });
        budget.extra = extra;

        setTotalCash(computedTotalCash);
        setBudgets(budgets =>
          budgets.map(el => (el.id === budget.id ? budget : el))
        );
      }
    });

    Budget.onInsert(({ changed }) => {
      const budget = changed[0];
      const multiplier =
        budget.frequency === 'D' ? differenceInDays : differenceInMonths;
      const extra =
        (multiplier(new Date(), new Date(budget.createdAt)) + 1) *
        budget.allocated;
      setBudgets(budgets => [...budgets, { ...budget, extra }]);
    });

    Transaction.onInsert(({ changed }) => {
      const transaction = changed[0];

      setTotalCash(totalCash => totalCash - transaction.amount);
      setBudgets(budgets =>
        budgets.map(budget =>
          budget.id === transaction.budget
            ? { ...budget, extra: budget.extra - transaction.amount }
            : budget
        )
      );
    });

    Transaction.onRemove(({ changed }) => {
      const transaction = changed[0];

      setTotalCash(totalCash => totalCash + transaction.amount);
      setBudgets(budgets =>
        budgets.map(budget =>
          budget.id === transaction.budget_id
            ? { ...budget, extra: budget.extra + transaction.amount }
            : budget
        )
      );
    });
  }, []);

  return (
    <DBContext.Provider value={{ db, budgets, cash, totalCash, totalExpenses }}>
      {children}
    </DBContext.Provider>
  );
}

export default DBContext;
