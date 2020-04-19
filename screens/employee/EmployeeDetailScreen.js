import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import GeoLocation from '../../components/location/Location';
const EmployeeDetailScreen = props => {
  const empId = props.navigation.getParam('employeeId');
  const selectedEmployee = useSelector(state =>
    state.employees.availableEmployees.find(emp => emp.id === empId)
  );

  
  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedEmployee.imageUrl }} />
      <Text style={styles.salary}>{selectedEmployee.emailId}</Text>
      <Text style={styles.salary}>{selectedEmployee.mobile}</Text>
      <Text style={styles.salary}>${selectedEmployee.salary.toFixed()}</Text>
      <Text style={styles.description}>{selectedEmployee.description}</Text>
      <GeoLocation style={{padding : 8}}/>
    </ScrollView>
  );
};

EmployeeDetailScreen.navigationOptions = navData => {
  return {
    headerTitle: navData.navigation.getParam('employeeTitle')
  };
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  salary: {
    fontSize: 20,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default EmployeeDetailScreen;
