import React, { useContext, useRef } from 'react';
import { Button, StyleSheet, ToastAndroid, View } from 'react-native';
import FormItem, { FORM_ITEM_TYPE } from '../components/FormItem';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import useForm from '../hooks/useForm';

function AddTransactionScreen() {
  const { changePage } = useContext(RouterContext);
  const { db, budgets } = useContext(DBContext);
  const { pageState } = useContext(RouterContext);

  const [values, onChange] = useForm({
    description: '',
    amount: '',
    budget: !!pageState.budget
      ? pageState.budget
      : budgets.length > 0
      ? budgets[0].id
      : null,
  });

  function addTransaction() {
    try {
      db.Transaction.insert({
        ...values,
        amount: +values.amount,
        createdAt: new Date(),
      });
      ToastAndroid.show('Transaction created', ToastAndroid.SHORT);
      changePage('/');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  }

  const descriptionInputRef = useRef();

  return (
    <View style={[styles.container]}>
      <View style={[styles.formItemsContainer]}>
        <FormItem
          type={FORM_ITEM_TYPE.PICKER}
          label="Allocate to"
          value={values.budget}
          onChange={onChange.budget}
          options={budgets.map(budget => ({
            value: budget.id,
            label: budget.name,
          }))}
        />
        <FormItem
          label="Amount"
          value={values.amount}
          onChange={onChange.amount}
          type={FORM_ITEM_TYPE.NUMBER}
          autoFocus={!!pageState.budget}
          onSubmitEditing={() => {
            descriptionInputRef.current.focus();
          }}
        />
        <FormItem
          label="Description"
          value={values.description}
          onChange={onChange.description}
          ref={descriptionInputRef}
          onSubmitEditing={addTransaction}
        />
      </View>
      <View style={[styles.buttonContainer]}>
        <Button title="ADD TRANSACTION" onPress={addTransaction} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  formItemsContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  buttonContainer: {
    margin: 10,
  },
});

export default AddTransactionScreen;
