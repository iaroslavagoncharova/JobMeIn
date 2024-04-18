import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useReports} from '../hooks/apiHooks';
import {ReportedUser, User} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ReportedUsers() {
  const {getReportedUsers} = useReports();
  const {update, setUpdate} = useUpdateContext();
  const [users, setUsers] = useState<ReportedUser[] | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const handleGetReportedUsers = async () => {
    const reportedUsers = await getReportedUsers();
    if (reportedUsers) {
      setUsers(reportedUsers);
    }
  };

  console.log(users);

  useEffect(() => {
    handleGetReportedUsers();
  }, [update]);

  const renderItem = ({item}: {item: ReportedUser}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.position}>Raportin syy: {item.report_reason}</Text>
      <Text style={styles.text}>Käyttäjänimi: {item.username}</Text>
      <Text style={styles.text}>Sähköpostiosoite: {item.email}</Text>
      <Text style={styles.text}>Puhelinnumero: {item.phone}</Text>
      <Text style={styles.text}>
        Isestä: {item.about_me ? item.about_me : 'Ei kuvausta'}
      </Text>
      <Text style={styles.text}>
        Status: {''}
        {item.status
          ? item.status === 'Active'
            ? 'Aktiivinen'
            : 'Ei aktiivinen'
          : ' Ei statusta'}
      </Text>
      <Text style={styles.text}>
        Linkki: {item.link ? item.link : 'Ei linkkiä'}
      </Text>
      <Text style={styles.text}>
        Valittu ala: {item.field ? item.field : 'Ei alaa'}
      </Text>
      <Text style={styles.text}>
        Käyttäjätyyppi: {item.user_type === 'candidate' && 'Työnhakija'}
      </Text>
      <Text style={styles.text}>Käyttäjän id: {item.user_id}</Text>
    </View>
  );

  return (
    <>
      <Text style={styles.text}>
        Tässä ovat käyttäjät, jotka on raportoitu sivuston ylläpidolle.
      </Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(user) => user.user_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    borderColor: '#5d71c9',
    borderWidth: 2,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5d71c9',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#5d71c9',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  matchContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#004aad',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchPercentage: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#5d71c9',
    textAlign: 'center',
    margin: 10,
  },
});
