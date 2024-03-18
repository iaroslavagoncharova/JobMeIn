import React, {useState} from 'react';

const useForm = <T>(callback: () => void, initState: T) => {
  const [inputs, setInputs] = useState<T>(initState);

  const handleSubmit = (event: React.SyntheticEvent) => {
    if (event) {
      event.preventDefault();
    }
    callback();
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.persist();
    console.log(event.target.name, event.target.value);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  return {
    handleSubmit,
    handleInputChange,
    inputs,
  };
};

export default useForm;
