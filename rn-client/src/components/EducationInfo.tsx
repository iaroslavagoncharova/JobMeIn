// import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
// import React, {useState} from 'react';
// import {Card} from '@rneui/base';
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
// import {faEdit} from '@fortawesome/free-solid-svg-icons';
// import {Education, EducationInfo} from '../types/DBTypes';

// export default function EducationInfo({education}: {education: Education[]}) {
//   const [eduEditing, setEduEditing] = useState<boolean>(false);
//   const styles = StyleSheet.create({
//     card: {
//       backgroundColor: '#ffffff',
//       margin: 5,
//       padding: 10,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     header: {
//       fontSize: 20,
//       fontWeight: 'bold',
//     },
//   });
//   return (
//     <Card containerStyle={styles.card}>
//       <Text style={styles.header}>Koulutus</Text>
//       {education.map((edu) => (
//         <Card key={edu.education_id}>
//           <Text>Koulu: {edu.school}</Text>
//           <Text>Tutkinto: {edu.degree}</Text>
//           <Text>Ala: {edu.field}</Text>
//           <Text>
//             Valmistumispäivä:{' '}
//             {new Date(edu.graduation).toLocaleDateString('fi-FI')}
//           </Text>
//           <TouchableOpacity>
//             <FontAwesomeIcon icon={faEdit} size={20} />
//           </TouchableOpacity>
//         </Card>
//       ))}
//       <TouchableOpacity>
//         <FontAwesomeIcon icon={faAdd} size={20} />
//         <Text>Lisää koulutus</Text>
//       </TouchableOpacity>
//     </Card>
//   );
// }
