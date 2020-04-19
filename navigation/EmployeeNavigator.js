import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createAppContainer
} from 'react-navigation';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import EmployeesOverviewScreen from '../screens/employee/EmployeesOverviewScreen';
import EmployeeDetailScreen from '../screens/employee/EmployeeDetailScreen';
import UserEmployeesScreen from '../screens/user/UserEmployeesScreen';
import EditEmployeestScreen from '../screens/user/EditEmployeeScreen';
import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const EmployeesNavigator = createStackNavigator(
  {
    EmployeesOverview: EmployeesOverviewScreen,
    EmployeeDetail: EmployeeDetailScreen
  },
  {
    defaultNavigationOptions: defaultNavOptions
  }
);



const AdminNavigator = createStackNavigator(
    {
      UserEmployees: UserEmployeesScreen,
      EditEmployee: EditEmployeestScreen
    },
    {
      defaultNavigationOptions: defaultNavOptions
    }
  );

const ShopNavigator = createDrawerNavigator(
  {
    Employees: EmployeesNavigator,
    Admin: AdminNavigator
  },
  {
    contentOptions: {
      activeTintColor: Colors.primary
    }
  }
);

export default createAppContainer(ShopNavigator);
