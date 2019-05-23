import React, { forwardRef } from 'react';
import { Picker, StyleSheet, Text, TextInput, View } from 'react-native';
import { STYLES } from '../global-styles';

export const FORM_ITEM_TYPE = {
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  PICKER: 'PICKER',
};

function FormItem(
  {
    type = FORM_ITEM_TYPE.TEXT,
    label,
    value,
    onChange,
    options,
    ...inputProps
  },
  ref
) {
  return (
    <View style={[styles.container]}>
      <Text style={[STYLES.TEXT]}>{label}</Text>
      {type === FORM_ITEM_TYPE.PICKER ? (
        <View style={[STYLES.INPUT]}>
          <Picker
            style={[STYLES.TEXT]}
            selectedValue={value}
            onValueChange={onChange}
            mode="dropdown"
            ref={ref}
          >
            {options.map(option => (
              <Picker.Item {...option} key={option.value} />
            ))}
          </Picker>
        </View>
      ) : (
        <TextInput
          keyboardType={
            type === FORM_ITEM_TYPE.NUMBER ? 'decimal-pad' : 'default'
          }
          style={[STYLES.TEXT, STYLES.INPUT]}
          value={value}
          onChangeText={onChange}
          ref={ref}
          {...inputProps}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
  },
});

export default forwardRef(FormItem);
