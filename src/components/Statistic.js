import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { STYLES } from '../global-styles';
import coloredNumber from '../utils/coloredNumber';
import commafy from '../utils/commafy';

function Statistic({ label, value, style }) {
  return (
    <View style={[styles.statisticContainer, style]}>
      <View style={[styles.statisticCell]}>
        <Text style={[styles.statisticText]}>{label}</Text>
      </View>
      <View style={[styles.statisticCell]}>
        <Text style={[styles.statistic, coloredNumber(value)]}>
          {value > 0 && '+'}
          {commafy(value)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statisticContainer: {
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statisticCell: {
    padding: 10,
    flex: 1,
  },
  statisticText: {
    ...STYLES.TEXT,
  },
  statistic: {
    ...STYLES.TEXT,
    textAlign: 'right',
  },
});

export default Statistic;
