import { format } from 'date-fns';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import { STYLES } from '../global-styles';
import commafy from '../utils/commafy';

function TransactionsScreen() {
  const { db } = useContext(DBContext);
  const { pageState } = useContext(RouterContext);

  const [isGettingTransactions, setIsGettingTransactions] = useState(true);
  const [transactionsMap, setTransactionsMap] = useState({});
  const [budgetsMap, setBudgetsMap] = useState({});

  useEffect(() => {
    if (db) {
      const newBudgetsMap = {};
      const dbBudgets = db.Budget.data();
      for (const budget of dbBudgets) {
        newBudgetsMap[budget.id] = budget;
      }
      setBudgetsMap(newBudgetsMap);

      const dbTransactions = !pageState.budget
        ? db.Transaction.data()
        : db.Transaction.filter({ budget_id: pageState.budget }).data();

      const newTransactionsMap = {};

      for (const transaction of dbTransactions) {
        const date = new Date(transaction.createdAt);

        const transactionDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );

        const dateLabel = format(transactionDate, 'ddd | MMM D, YYYY');

        if (!newTransactionsMap[transactionDate.getTime()]) {
          newTransactionsMap[transactionDate.getTime()] = {
            label: dateLabel,
            transactions: [],
          };
        }

        newTransactionsMap[transactionDate.getTime()].transactions.push(
          transaction
        );
      }

      setTransactionsMap(newTransactionsMap);
      setIsGettingTransactions(false);
    }
  }, [db]);

  function handleDeleteTransaction(transaction) {
    Alert.alert(
      'Delete this transaction?',
      `Budget: ${
        budgetsMap[transaction.budget_id].name
      }\nDescription: ${transaction.description || '—'}\nAmount: ${
        transaction.amount
      }`,
      [
        {
          text: 'OK',
          onPress: () => {
            try {
              db.Transaction.remove(transaction.id);
              const newTransactionsMap = { ...transactionsMap };
              for (const key of Object.keys(newTransactionsMap)) {
                newTransactionsMap[key].transactions = newTransactionsMap[
                  key
                ].transactions.filter(t => t.id !== transaction.id);
                if (newTransactionsMap[key].transactions.length === 0) {
                  delete newTransactionsMap[key];
                }
              }
              setTransactionsMap(newTransactionsMap);

              ToastAndroid.show('Transaction deleted', ToastAndroid.SHORT);
            } catch (err) {
              ToastAndroid.show(err.message, ToastAndroid.SHORT);
            }
          },
        },
      ]
    );
  }

  return (
    <View
      style={[
        ((!isGettingTransactions &&
          Object.keys(transactionsMap).length === 0) ||
          isGettingTransactions) &&
          styles.container,
      ]}
    >
      {isGettingTransactions && (
        <ActivityIndicator size="large" color="#5e9bea" />
      )}
      {!isGettingTransactions && Object.keys(transactionsMap).length === 0 && (
        <Text style={[STYLES.TEXT]}>
          No transactions{' '}
          {pageState.budget &&
            `in ${budgetsMap[pageState.budget] &&
              budgetsMap[pageState.budget].name}`}
        </Text>
      )}
      {!isGettingTransactions && Object.keys(transactionsMap).length > 0 && (
        <View style={[styles.cell, { marginBottom: 20 }]}>
          <Text style={[STYLES.TEXT, { fontWeight: 'bold' }]}>
            Budget:{' '}
            {budgetsMap[pageState.budget]
              ? budgetsMap[pageState.budget].name
              : 'All'}
          </Text>
        </View>
      )}
      {!isGettingTransactions &&
        Object.keys(transactionsMap)
          .sort()
          .map(key => {
            return (
              <Fragment key={key}>
                <View
                  style={[
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                    },
                  ]}
                >
                  <Text style={[STYLES.TEXT, { fontWeight: 'bold' }]}>
                    {transactionsMap[key].label}
                  </Text>
                </View>
                {[...transactionsMap[key].transactions]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map(transaction => {
                    const budget = budgetsMap[transaction.budget_id];

                    return (
                      <TouchableOpacity
                        style={[styles.transactionContainer]}
                        key={transaction.id}
                        onPress={() => handleDeleteTransaction(transaction)}
                      >
                        {!pageState.budget && (
                          <View style={[styles.cell, { flex: 2 }]}>
                            <Text style={[styles.transactionText]}>
                              {budget.name}
                            </Text>
                          </View>
                        )}
                        <View style={[styles.cell, { flex: 2 }]}>
                          <Text style={[styles.transactionText]}>
                            {transaction.description || '—'}
                          </Text>
                        </View>
                        <View style={[styles.cell]}>
                          <Text
                            style={[
                              styles.transactionText,
                              { textAlign: 'right' },
                            ]}
                          >
                            {commafy(transaction.amount)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </Fragment>
            );
          })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionHeaderLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginTop: 10,
  },
  transactionContainer: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
    padding: 10,
  },
  transactionText: {
    ...STYLES.TEXT,
    fontSize: 14,
  },
});

export default TransactionsScreen;
