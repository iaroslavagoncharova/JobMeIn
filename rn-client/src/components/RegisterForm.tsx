import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useState} from 'react';

const styles = StyleSheet.create({
  registerForm: {
    flex: 1,
    position: 'relative',
    marginTop: 20,
    alignItems: 'center',
  },
  inputWithLabel: {
    flex: 1,
    width: 250,
    marginTop: 10,
    padding: 0,
    height: 40,
  },
  labelText: {
    fontSize: 10,
    marginLeft: 0,
  },
  input: {
    height: 40,
    width: 250,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    borderColor: '#e0e0e0',
    color: '#004aad',
    flexDirection: 'row',
  },
  datePicker: {
    flex: 1,
    borderLeftColor: '#5d71c9',
  },
  registerButton: {
    marginTop: 0,
    width: 250,
    backgroundColor: '#5d71c9',
    marginBottom: 30,
    borderRadius: 5,
  },
});

const RegisterForm = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('' as string);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;
    setDate(formattedDate);
    hideDatePicker();
  };

  return (
    <View style={styles.registerForm}>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>NIMI</Text>
        <TextInput
          style={styles.input}
          placeholder="Matti Meikäläinen"
          keyboardType="default"
          autoCorrect={false}
          inputMode="text"
        />
      </View>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>SÄHKÖPOSTIOSOITE</Text>
        <TextInput
          style={styles.input}
          placeholder="mattimeikalainen@example.com"
          keyboardType="default"
          autoCorrect={false}
          inputMode="email"
        />
      </View>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>SALASANA</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="********"
          keyboardType="default"
        />
      </View>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>SYNTYMÄAIKA</Text>
        <View style={styles.input}>
          <TextInput
            id="date"
            value={date}
            style={{flex: 10}}
            placeholder="pp.kk.vvvv"
            inputMode="none"
          />
          <TouchableOpacity style={styles.datePicker} onPress={showDatePicker}>
            <FontAwesomeIcon icon={faCalendar} size={20} color={'#004aad'} />
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.registerButton} onPress={() => {}}>
        <Text
          style={{
            color: '#ffffff',
            padding: 10,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Luo profiili
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterForm;
