import React, { useContext } from 'react';
import { Button, StyleSheet, ToastAndroid, View } from 'react-native';
import FormItem, { FORM_ITEM_TYPE } from '../components/FormItem';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import useForm from '../hooks/useForm';

function IncomeScreen() {
  const { db, income } = useContext(DBContext);
  const { changePage } = useContext(RouterContext);
  const [values, onChange] = useForm({
    amount: String(income.amount),
    addAmount: '',
  });

  function updateIncome() {
    try {
      db.Income.update(income.id, {
        amount: +values.amount,
      });
      ToastAndroid.show('Income updated', ToastAndroid.SHORT);
      changePage('/');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.formItemsContainer]}>
        <FormItem
          type={FORM_ITEM_TYPE.NUMBER}
          label="Income"
          value={values.amount}
          onChange={onChange.amount}
        />
      </View>

      <View style={[styles.buttonContainer]}>
        <Button title="UPDATE" onPress={updateIncome} />
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
  },
  buttonContainer: {
    margin: 10,
  },
});

export default IncomeScreen;
