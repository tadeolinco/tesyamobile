import { format } from 'date-fns';
import React, { Fragment, useContext, useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import { STYLES } from '../global-styles';
import coloredNumber from '../utils/coloredNumber';
import commafy from '../utils/commafy';

function TransactionsScreen() {
  const { db, budgetsMeta, transactions } = useContext(DBContext);
  const { pageState } = useContext(RouterContext);

  const transactionsMap = useMemo(() => {
    const budgetTransactions = !pageState.budget
      ? transactions
      : budgetsMeta[pageState.budget].transactions;

    const transactionsMap = {};

    for (const transaction of budgetTransactions) {
      const date = new Date(transaction.createdAt);

      const transactionDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      const dateLabel = format(transactionDate, 'ddd | MMM D, YYYY');

      if (!transactionsMap[transactionDate.getTime()]) {
        transactionsMap[transactionDate.getTime()] = {
          label: dateLabel,
          transactions: [],
        };
      }

      transactionsMap[transactionDate.getTime()].transactions.push(transaction);
    }
    return transactionsMap;
  }, [budgetsMeta, transactions]);

  function handleDeleteTransaction(transaction) {
    Alert.alert(
      'Delete this transaction?',
      `Budget: ${
        budgetsMeta[transaction.budget_id || transaction.budget].budget.name
      }\nDescription: ${transaction.description || '—'}\nAmount: ${
        transaction.amount
      }`,
      [
        {
          text: 'OK',
          onPress: () => {
            try {
              db.Transaction.remove(transaction.id);
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
    <ScrollView
      contentContainerStyle={[
        Object.keys(transactionsMap).length === 0 && styles.container,
      ]}
    >
      {Object.keys(transactionsMap).length === 0 && (
        <Text style={[STYLES.TEXT]}>
          No transactions{' '}
          {pageState.budget &&
            `in ${budgetsMeta[pageState.budget].budget.name}`}
        </Text>
      )}
      {Object.keys(transactionsMap).length > 0 && (
        <View style={[styles.cell, { marginBottom: 20 }]}>
          <Text style={[STYLES.TEXT, { fontWeight: 'bold' }]}>
            Budget:{' '}
            {budgetsMeta[pageState.budget]
              ? budgetsMeta[pageState.budget].budget.name
              : 'All'}
          </Text>
        </View>
      )}
      {Object.keys(transactionsMap)
        .sort()
        .reverse()
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
                  const budget =
                    budgetsMeta[transaction.budget_id || transaction.budget]
                      .budget;

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
                            coloredNumber(-transaction.amount),
                          ]}
                        >
                          {commafy(-transaction.amount)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </Fragment>
          );
        })}
    </ScrollView>
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
