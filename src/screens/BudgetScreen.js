import React, { useContext } from 'react';
import { Alert, Button, StyleSheet, ToastAndroid, View } from 'react-native';
import FormItem, { FORM_ITEM_TYPE } from '../components/FormItem';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import useForm from '../hooks/useForm';

function BudgetScreen() {
  const { db } = useContext(DBContext);
  const { changePage, pageState } = useContext(RouterContext);
  const { budget } = pageState;

  const [values, onChange] = useForm({
    name: budget.name,
    allocated: String(budget.allocated),
    frequency: budget.frequency,
  });

  function updateBudget() {
    try {
      db.Budget.update(budget.id, {
        ...values,
        allocated: +values.allocated,
      });
      ToastAndroid.show('Budget updated', ToastAndroid.SHORT);
      changePage('/');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  }

  function removeBudget() {
    Alert.alert('Are you sure you want to delete?', '', [
      {
        text: 'OK',
        onPress: () => {
          try {
            db.Budget.remove(budget.id);
            ToastAndroid.show('Budget removed', ToastAndroid.SHORT);
            changePage('/');
          } catch (err) {
            ToastAndroid.show(err.message, ToastAndroid.SHORT);
          }
        },
      },
    ]);
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.formItemsContainer]}>
        <FormItem label="Name" value={values.name} onChange={onChange.name} />
        <FormItem
          type={FORM_ITEM_TYPE.NUMBER}
          label="Budget Allocated"
          value={values.allocated}
          onChange={onChange.allocated}
          keyboardType="decimal-pad"
        />
        <FormItem
          type={FORM_ITEM_TYPE.PICKER}
          label="Frequency"
          value={values.frequency}
          onChange={onChange.frequency}
          options={[
            { label: 'Daily', value: 'D' },
            {
              label: 'Monthly',
              value: 'M',
            },
          ]}
        />
      </View>

      <View style={[styles.buttonContainer]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button
            style={{ flex: 1, marginRight: 10 }}
            title="REMOVE BUDGET"
            onPress={removeBudget}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            style={{ flex: 1, marginRight: 10 }}
            title="EDIT BUDGET"
            onPress={updateBudget}
          />
        </View>
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
    flexDirection: 'row',
    margin: 10,
  },
});

export default BudgetScreen;
