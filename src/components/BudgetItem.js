import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STYLES } from '../global-styles';
import coloredNumber from '../utils/coloredNumber';
import commafy from '../utils/commafy';
import { RouterContext } from './Router';

function BudgetItem(budget) {
  const { changePage } = useContext(RouterContext);
  const { name, allocated, extra, frequency, id } = budget;

  return (
    <View style={[styles.container]}>
      <View style={[styles.cell, styles.nameCell]}>
        <TouchableOpacity
          onPress={() => {
            changePage('/budget', { budget });
          }}
        >
          <Text style={[STYLES.TEXT, styles.underline]}>{name}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.cell]}>
        <TouchableOpacity
          onPress={() => {
            changePage('/add-transaction', {
              budget: id,
            });
          }}
        >
          <Text
            style={[
              STYLES.TEXT,
              styles.alignRight,
              styles.underline,
              coloredNumber(extra),
            ]}
          >
            {extra > 0 && '+'}
            {commafy(extra)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.cell]}>
        <TouchableOpacity
          onPress={() => {
            changePage('/transactions', { budget: id });
          }}
        >
          <Text
            style={[
              STYLES.TEXT,
              styles.alignRight,
              styles.allocated,
              styles.underline,
            ]}
          >
            {commafy(allocated)}/{frequency}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    padding: 10,
    flex: 4,
  },
  nameCell: {
    flex: 5,
  },
  underline: {
    textDecorationLine: 'underline',
  },
  alignRight: {
    textAlign: 'right',
  },
  allocated: {
    color: '#5e9bea',
  },
});

export default BudgetItem;
