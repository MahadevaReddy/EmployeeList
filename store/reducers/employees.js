import EMPLOYEES from '../../data/dummy-data';
import {
  DELETE_EMPLOYEE,
  CREATE_EMPLOYEE,
  UPDATE_EMPLOYEE,
  SET_EMPLOYEES
} from '../actions/employees';
import Employee from '../../models/employee';

const initialState = {
  availableEmployees: EMPLOYEES,
  userEmployees: EMPLOYEES.filter(emp => emp.employerId === 'u1')
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EMPLOYEES:
      return {
        availableEmployees: action.employees,
        userEmployees: action.employees.filter(emp => emp.employerId === 'u1')
      };
    case CREATE_EMPLOYEE:
      const newEmployee = new Employee(
        action.employeeData.id,
        'u1',
        action.employeeData.title,
        action.employeeData.imageUrl,
        action.employeeData.description,
        action.employeeData.salary,
        action.employeeData.emailId,
        action.employeeData.mobile
      );
      return {
        ...state,
        availableEmployees: state.availableEmployees.concat(newEmployee),
        userEmployees: state.userEmployees.concat(newEmployee)
      };
    case UPDATE_EMPLOYEE:
      const empIndex = state.userEmployees.findIndex(
        emp => emp.id === action.pid
      );
      const updatedEmployee = new Employee(
        action.pid,
        state.userEmployees[empIndex].employerId,
        action.employeeData.title,
        action.employeeData.imageUrl,
        action.employeeData.description,
        state.userEmployees[empIndex].salary,
        state.userEmployees[empIndex].emailId,
        state.userEmployees[empIndex].mobile,
      );
      const updatedEmployees = [...state.userEmployees];
      updatedEmployees[empIndex] = updatedEmployee;
      const availableEmployeeIndex = state.availableEmployees.findIndex(
        emp => emp.id === action.pid
      );
      const updatedAvailableEmployees = [...state.availableEmployees];
      updatedAvailableEmployees[availableEmployeeIndex] = updatedEmployee;
      return {
        ...state,
        availableEmployees: updatedAvailableEmployees,
        userEmployees: updatedEmployees
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        userEmployees: state.userEmployees.filter(
          employee => employee.id !== action.pid
        ),
        availableEmployees: state.availableEmployees.filter(
          employee => employee.id !== action.pid
        )
      };
  }
  return state;
};
