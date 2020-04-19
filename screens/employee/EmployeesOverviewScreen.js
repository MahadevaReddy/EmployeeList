import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import EmployeeItem from '../../components/employee/EmployeeItem';
import * as employeesActions from '../../store/actions/employees';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const employees = useSelector(state => state.employees.availableEmployees);
  const dispatch = useDispatch();

  const loadEmployees = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(employeesActions.fetchEmployees());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadEmployees
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadEmployees]);

  useEffect(() => {
    setIsLoading(true);
    loadEmployees().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadEmployees]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('EmployeeDetail', {
      employeeId: id,
      employeeTitle: title
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadEmployees}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && employees.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadEmployees}
      refreshing={isRefreshing}
      data={employees}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <EmployeeItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          salary={itemData.item.salary}
          email={itemData.item.emailId}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
        </EmployeeItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Employees',
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
    )
  };
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default ProductsOverviewScreen;
