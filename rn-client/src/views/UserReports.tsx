import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useReports} from '../hooks/apiHooks';
import {Report} from '../types/DBTypes';

export default function UserReports(route: {route: any}) {
  const user_id = route.route.params.userId;
  console.log(user_id);
  const [reports, setReports] = useState<Report[] | null>(null);
  const {getReportsByUser} = useReports();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const handleGetReports = async () => {
    const reports = await getReportsByUser(user_id);
    if (reports) {
      setReports(reports);
    }
  };
  console.log(reports);
  useEffect(() => {
    handleGetReports();
  }, []);
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 15,
      margin: 20,
      width: '90%',
      borderRadius: 25,
      alignItems: 'center',
    },
    header: {
      color: '#5d71c9',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    bigHeader: {
      color: '#5d71c9',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      fontSize: 16,
      color: '#5d71c9',
      textAlign: 'center',
    },
    boldText: {
      fontSize: 16,
      color: '#5d71c9',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
    },
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderColor: '#5d71c9',
    },
    cancelButton: {
      margin: 5,
      backgroundColor: '#ffffff',
      borderColor: '#5d71c9',
      borderWidth: 1,
      color: '#5d71c9',
      borderRadius: 12,
    },
    saveButton: {
      margin: 5,
      backgroundColor: '#5d71c9',
      borderRadius: 12,
    },
    input: {
      height: 40,
      margin: 5,
      borderWidth: 1,
      borderColor: '#5d71c9',
      borderRadius: 12,
      padding: 10,
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bigHeader}>Käyttäjän ilmiannot</Text>
          <Text style={styles.text}>
            Klikkaa ilmiannon tiedot nähdäksesi kaikki ilmiannot
          </Text>
          <Card containerStyle={{borderRadius: 10}}>
            {reports?.map((report, index) => (
              <Card key={index} containerStyle={styles.card}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ilmiannot')}
                >
                  <Text style={styles.header}>Ilmiannon tiedot</Text>
                  <Text style={styles.text}>
                    Ilmiannon status:{' '}
                    {report.is_resolved
                      ? report.is_resolved === 'not_resolved'
                        ? 'Ei ratkaistu'
                        : 'Ratkaistu'
                      : 'Ei ratkaistu'}
                  </Text>
                  <Text style={styles.text}>
                    Raportoitu ID: {report.reported_item_id}
                  </Text>
                  <Text style={styles.text}>
                    Ilmiannon tyyppi:{' '}
                    {report.reported_item_type
                      ? report.reported_item_type === 'User'
                        ? 'Käyttäjä'
                        : 'Työpaikka'
                      : 'Käyttäjä'}
                  </Text>
                  <Text style={styles.text}>
                    Ilmiannon syy: {report.report_reason}
                  </Text>
                </TouchableOpacity>
              </Card>
            ))}
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}
