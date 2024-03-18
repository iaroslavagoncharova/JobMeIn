import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Card, Input} from '@rneui/base';
import {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {useUser} from '../hooks/apiHooks';

const RegisterForm = () => {
  const {postUser} = useUser();
  const initValues = {
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    userType: '',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const doRegister = async (inputs: {
    fullname: string;
    email: string;
    password: string;
    confirmPassword?: string;
    dateOfBirth?: string;
    userType: string;
  }) => {
    console.log(inputs);
    try {
      delete inputs.confirmPassword;
      delete inputs.dateOfBirth;
      await postUser(inputs);
      Alert.alert('User created', 'You can now login');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState('' as string);
  const [dateString, setDateString] = useState('' as string);

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
    setDate(date.toDateString());
    setDateString(formattedDate);
    hideDatePicker();
  };

  const getAge = (date: Date) => {
    const today = new Date();
    const birthDate = date;
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const [openUserTypes, setOpenUserTypes] = useState(false);
  const [userTypeValue, setUserTypeValue] = useState(null);
  const [userTypeItems, setUserTypeItems] = useState([
    {label: 'Työnhakija', value: 'Työnhakija'},
    {label: 'Yritys', value: 'Yritys'},
  ]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Ole hyvä ja syötä nimesi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>NIMI</Text>
            <Input
              style={styles.input}
              placeholder="Matti Mehiläinen"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.fullname?.message}
            />
          </View>
        )}
        name="fullname"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Sähköpostiosoite ei ole validi',
          },
          /* validate: async (value) => {
            try {
              const {available} = await getEmailAvailable(value);
              return available
                ? available
                : 'Sähköpostiosoitteeseen on jo liitetty tili';
            } catch (error) {
              console.log((error as Error).message);
            }
          }, */
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SÄHKÖPOSTIOSOITE</Text>
            <Input
              style={styles.input}
              placeholder="mattimeikalainen@example.com"
              keyboardType="default"
              autoCorrect={false}
              inputMode="email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
              autoCapitalize="none"
            />
          </View>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SALASANA</Text>
            <Input
              style={styles.input}
              secureTextEntry
              placeholder="Salasana"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          </View>
        )}
        name="password"
      />

      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: (value) =>
            value === getValues().password ? true : 'Passwords do not match',
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SALASANA UUDELLEEN</Text>
            <Input
              style={styles.input}
              secureTextEntry
              placeholder="Vahvista salasana"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.confirmPassword?.message}
            />
          </View>
        )}
        name="confirmPassword"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
          validate: (value) => {
            if (getAge(new Date(value)) < 15) {
              return 'Olethan yli 15-vuotias';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SYNTYMÄAIKA</Text>
            <View style={styles.input}>
              <TextInput
                id="date"
                onBlur={onBlur}
                onChangeText={(value) => {
                  onChange(value);
                  setDate(value);
                }}
                value={date}
                style={{flex: 10}}
                placeholder="pp.kk.vvvv"
                inputMode="none"
              />
              <TouchableOpacity
                style={styles.datePicker}
                onPress={showDatePicker}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  size={20}
                  color={'#004aad'}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        name="dateOfBirth"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>TILITYYPPI</Text>
            <DropDownPicker
              style={styles.input}
              open={openUserTypes}
              value={userTypeValue}
              items={userTypeItems}
              setOpen={setOpenUserTypes}
              setValue={setUserTypeValue}
              setItems={setUserTypeItems}
              onChangeValue={onChange}
            />
          </View>
        )}
        name="userType"
      />
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit(doRegister)}
      >
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
    </Card>
  );
};

const styles = StyleSheet.create({
  registerForm: {
    flex: 1,
    position: 'relative',
    marginTop: 15,
    alignItems: 'center',
  },
  inputWithLabel: {
    width: 250,
    paddingVertical: 10,
    marginBottom: 30,
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
    marginTop: 20,
    width: 250,
    backgroundColor: '#5d71c9',
    borderRadius: 5,
  },
});

export default RegisterForm;
