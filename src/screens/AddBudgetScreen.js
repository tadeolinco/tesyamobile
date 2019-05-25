import React, { useContext, useRef } from 'react';
import { Button, StyleSheet, ToastAndroid, View } from 'react-native';
import FormItem, { FORM_ITEM_TYPE } from '../components/FormItem';
import { RouterContext } from '../components/Router';
import DBContext from '../context/DBContext';
import useForm from '../hooks/useForm';

function AddBudgetScreen() {
  const { db } = useContext(DBContext);
  const { changePage } = useContext(RouterContext);
  const [values, onChange] = useForm({
    name: '',
    allocated: '',
    frequency: 'D',
    createdAt: new Date(),
  });

  function addBudget() {
    try {
      db.Budget.insert({
        ...values,
        createdAt: new Date(values.createdAt),
        allocated: +values.allocated,
        transactions: [],
      });
      ToastAndroid.show('Budget created', ToastAndroid.SHORT);
      changePage('/');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  }

  const allocatedInputRef = useRef();

  return (
    <View style={[styles.container]}>
      <View style={[styles.formItemsContainer]}>
        <FormItem
          label="Name"
          value={values.name}
          onChange={onChange.name}
          autoFocus
          onSubmitEditing={() => allocatedInputRef.current.focus()}
        />
        <FormItem
          type={FORM_ITEM_TYPE.NUMBER}
          label="Budget Allocated"
          value={values.allocated}
          onChange={onChange.allocated}
          ref={allocatedInputRef}
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
        <FormItem
          type={FORM_ITEM_TYPE.DATE}
          label="Start Date:"
          value={values.createdAt}
          onChange={onChange.createdAt}
        />
      </View>

      <View style={[styles.buttonContainer]}>
        <Button title="ADD BUDGET" onPress={addBudget} />
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

export default AddBudgetScreen;
