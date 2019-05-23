import { StyleSheet } from 'react-native';

function coloredNumber(num) {
  return num === 0
    ? styles.neutral
    : num > 0
    ? styles.positive
    : styles.negative;
}

const styles = StyleSheet.create({
  positive: {
    color: '#7ace68',
  },
  negative: {
    color: '#db4161',
  },
  neutral: {
    color: '#b3b3b3',
  },
});

export default coloredNumber;
