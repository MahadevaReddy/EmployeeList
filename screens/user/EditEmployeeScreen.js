import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import * as employeesActions from '../../store/actions/employees';
import Input from '../../components/UI/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditEmployeeScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState();
  const [error, setError] = useState();

  const empId = props.navigation.getParam('employeeId');
  const editedEmployee = useSelector(state =>
    state.employees.userEmployees.find(emp => emp.id === empId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedEmployee ? editedEmployee.title : '',
      imageUrl: editedEmployee ? editedEmployee.imageUrl : '',
      description: editedEmployee ? editedEmployee.description : '',
      salary: '',
      emailId: editedEmployee ? editedEmployee.emailId : '',
      mobile: editedEmployee ? editedEmployee.mobile : '',
    },
    inputValidities: {
      title: editedEmployee ? true : false,
      imageUrl: editedEmployee ? true : false,
      description: editedEmployee ? true : false,
      salary: editedEmployee ? true : false,
      emailId: editedEmployee ? true : false,
      mobile: editedEmployee ? true : false
    },
    formIsValid: editedEmployee ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedEmployee) {
        await dispatch(
          employeesActions.updateEmployee(
            empId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        );
      } else {
        await dispatch(
          employeesActions.createEmployee(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.salary,
            formState.inputValues.emailId,
            formState.inputValues.mobile
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);

  }, [dispatch, empId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const imageTakenHandler = imagePath => {
    console.log(imagePath);
    setSelectedImage(imagePath);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <ImagePicker onImageTaken={imageTakenHandler} />
        <View style={styles.form}>
          <Input
            id="title"
            label="Full Name"
            errorText="Please enter a valid employee name!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEmployee ? editedEmployee.title : ''}
            initiallyValid={!!editedEmployee}
            required
          />
          <Input
            id="emailId"
            label="Email"
            errorText="Please enter a valid email!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEmployee ? editedEmployee.emailId : ''}
            initiallyValid={!!editedEmployee}
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEmployee ? editedEmployee.imageUrl : selectedImage}
            initiallyValid={!!editedEmployee}
            required
          />
          <Input
            id="mobile"
            label="Mobile Number"
            errorText="Please enter a valid mobile number!"
            keyboardType='phone-pad'
            maxLength={10}
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedEmployee ? editedEmployee.mobile : ''}
            initiallyValid={!!editedEmployee}
            required
          />
          {editedEmployee ? null : (
            <Input
              id="salary"
              label="Salary"
              errorText="Please enter a valid Salary!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="About Employee"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedEmployee ? editedEmployee.description : ''}
            initiallyValid={!!editedEmployee}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditEmployeeScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('employeeId')
      ? 'Edit Employee'
      : 'Add Employee',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-save' : 'ios-save'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditEmployeeScreen;
