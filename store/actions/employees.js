import Employee from '../../models/employee';

export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';
export const CREATE_EMPLOYEE = 'CREATE_EMPLOYEE';
export const UPDATE_EMPLOYEE = 'UPDATE_EMPLOYEE';
export const SET_EMPLOYEES = 'SET_EMPLOYEES';

export const fetchEmployees = () => {
  return async dispatch => {
    // any async code you want!
    try {
      const response = await fetch(
        'https://employeelist-e8dca.firebaseio.com/employees.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      console.log(resData);
      const loadedEmployees = [];

      for (const key in resData) {
        loadedEmployees.push(
          new Employee(
            key,
            'u1',
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].salary, 
            resData[key].emailId,
            resData[key].mobile
          )
        );
      }

      dispatch({ type: SET_EMPLOYEES, employees: loadedEmployees });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const deleteEmployee = employeeId => {
  return async dispatch => {
    const response = await fetch(
      `https://employeelist-e8dca.firebaseio.com/employees/${employeeId}.json`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    dispatch({ type: DELETE_EMPLOYEE, pid: employeeId });
  };
};

export const createEmployee = (title, description, imageUrl, salary, emailId, mobile) => {
  return async dispatch => {
    // any async code you want!
    const response = await fetch(
      'https://employeelist-e8dca.firebaseio.com/employees.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          salary,
          emailId,
          mobile
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: UPDATE_EMPLOYEE,
      employeeData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        salary,
        emailId,
        mobile
      }
    });
  };
};

export const updateEmployee = (id, title, description, imageUrl) => {
  return async dispatch => {
    const response = await fetch(
      `https://employeelist-e8dca.firebaseio.com/employees/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl
        })
      }
    );

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    dispatch({
      type: UPDATE_EMPLOYEE,
      pid: id,
      employeeData: {
        title,
        description,
        imageUrl
      }
    });
  };
};
