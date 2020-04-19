import React from 'react';
import { FlatList, Button, Platform, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import EmployeeItem from '../../components/employee/EmployeeItem';
import Colors from '../../constants/Colors';
import * as employeeActions from '../../store/actions/employees';

const UserEmployeesScreen = props => {
  const myEmployees = useSelector(state => state.employees.userEmployees);
  const dispatch = useDispatch();

  const editProductHandler = id => {
    props.navigation.navigate('EditEmployee', { employeeId: id });
  };

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(employeeActions.deleteEmployee(id));
        }
      }
    ]);
  };

  return (
    <FlatList
      data={myEmployees}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <EmployeeItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          salary={itemData.item.salary}
          email={itemData.item.emailId}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </EmployeeItem>
      )}
    />
  );
};

UserEmployeesScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Employees',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          onPress={() => {
            navData.navigation.navigate('EditEmployee');
          }}
        />
      </HeaderButtons>
    )
  };
};

export default UserEmployeesScreen;
