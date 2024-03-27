import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ListItem} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd, faEdit} from '@fortawesome/free-solid-svg-icons';
import {useUserContext} from '../hooks/ContextHooks';

const Profile = () => {
  const {user} = useUserContext();
  console.log(user);
  // const skills = [
  //   {
  //     skill_id: 1,
  //     skill_name: 'JavaScript',
  //     type: 'hard',
  //   },
  //   {
  //     skill_id: 2,
  //     skill_name: 'React Native',
  //     type: 'hard',
  //   },
  //   {
  //     skill_id: 3,
  //     skill_name: 'Asiakaspalvelu',
  //     type: 'soft',
  //   },
  //   {
  //     skill_id: 4,
  //     skill_name: 'Tiimityö',
  //     type: 'soft',
  //   },
  //   {
  //     skill_id: 5,
  //     skill_name: 'Kommunikaatio',
  //     type: 'soft',
  //   },
  // ];

  const tests = [
    {
      test_id: 1,
      test_name: 'IQ-testi',
      type: 'platform',
      completed_at: '2024-03-23',
    },
    {
      test_id: 2,
      test_name: 'EQ-testi',
      type: 'platform',
      completed_at: '2024-03-23',
    },
    {
      test_id: 3,
      test_name: 'Persoonallisuustesti',
      type: 'platform',
      completed_at: '2024-03-23',
    },
  ];
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 30,
      marginTop: 40,
      width: '85%',
      borderRadius: 25,
    },
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
    },
    bigHeader: {
      color: '#5d71c9',
      fontSize: 25,
      fontWeight: 'bold',
    },
  });
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#5d71c9',
      }}
    >
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text>{user?.fullname}</Text>
            <Image source={{uri: 'https://via.placeholder.com/150'}} />
          </View>
          <Text style={styles.bigHeader}>Profiili</Text>
          <View>
            <Text style={styles.header}>Henkilötiedot</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faEdit} size={20} />
            </TouchableOpacity>
            <Text>Nimi: {user?.fullname}</Text>
            <Text>Sähköpostiosoite: {user?.email}</Text>
            <Text>Salasana: ******** </Text>
            <Text>Käyttäjänimi: {user?.username}</Text>
            <Text>Puhelinnumero: {user?.phone}</Text>
            <Text>Kerro itsestäsi: {user?.about_me}</Text>
          </View>
          <View>
            <Text style={styles.header}>Koulutus</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faEdit} size={20} />
              <FontAwesomeIcon icon={faAdd} size={20} />
              <Text>Lisää koulutus</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.header}>Työkokemus</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faEdit} size={20} />
              <FontAwesomeIcon icon={faAdd} size={20} />
              <Text>Lisää työkokemus</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.header}>Taidot</Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faEdit} size={20} />
              <FontAwesomeIcon icon={faAdd} size={20} />
              <Text>Lisää taidot</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.bigHeader}>Testit</Text>
            {tests.map((test) => (
              <ListItem key={test.test_id}>
                <Text>{test.test_name}</Text>
                <Text>
                  {new Date(test.completed_at).toLocaleDateString('fi-FI')}
                </Text>
              </ListItem>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Profile;
