import { useState } from 'react';

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const onChange = {};
  Object.keys(initialValues).forEach(key => {
    onChange[key] = value => {
      if (typeof value === 'object') {
        setValues({ ...values, [key]: value.currentTarget.value });
      } else {
        setValues({ ...values, [key]: value });
      }
    };
  });

  return [values, onChange];
}

export default useForm;
