import { takeEvery, put, call, select } from "redux-saga/effects";
import axios from "axios";
import { tokenConfig } from "../../state/actions/authActions";
import { tokenAdminConfig } from "../../state/actions/authAdminActions";
import {
  GET_EMPLOYEES,
  GET_EMPLOYEE_BY_ID,
  ADD_EMPLOYEE,
  EMPLOYEES_RECEIVED,
  EMPLOYEE_RECEIVED,
  EMPLOYEE_ADDED,
  DELETE_EMPLOYEE,
  EMPLOYEE_DELETED,
  UPDATE_EMPLOYEE,
  EMPLOYEE_UPDATED,
  GET_EMPLOYEES_BY_SHOP,
  EMPLOYEE_LOGOUT,
  SHOW_NOTI,
} from "../actions/types";
import { ADD_NOTIFICATION } from "react-redux-notify";
import { NOTI_SUCCESS } from "./NotificationObject";

function* fetchEmpById(params) {
  try {
    const state = yield select(),
      { id } = params;
    const response = yield call(() =>
      axios.get(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/${id}`,
        tokenConfig(state)
      )
    );

    yield put({ type: EMPLOYEE_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
    let err = { ...error };
    if (err.response.status == 401) {
      yield put({ type: EMPLOYEE_LOGOUT });
      this.props.history.push({
        pathname: "/seller/login",
      });
    }
  }
}

function* fetchEmployees(params) {
  try {
    const state = yield select(),
      { limit, page, query, idShop, deletedEmp, activeEmp } = params.pages;

    const response = yield call(() =>
      axios.get(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/shop/${idShop}?limit=${limit}&page=${page}&query=${query}&deletedEmp=${deletedEmp}&activeEmp=${activeEmp}`,
        tokenConfig(state)
      )
    );

    // const response = yield call(getEmployeesAPI, {
    //   params: params.pages,
    //   state: state,
    // });
    yield put({ type: EMPLOYEES_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
    let err = { ...error };
    if (err.response.status == 401) {
      this.props.history.push({
        pathname: "/login",
      });
    }
  }
}

function* fetchEmployeesByShop(params) {
  try {
    const state = yield select(),
      {
        limit,
        page,
        query,
        idShop,
        deletedEmp,
        activeEmp,
        isAdmin,
      } = params.pages;

    const response = yield call(() =>
      axios.get(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/shop/${idShop}?limit=${limit}&page=${page}&query=${query}&deletedEmp=${deletedEmp}&activeEmp=${activeEmp}`,
        isAdmin ? tokenAdminConfig(state) : tokenConfig(state)
      )
    );

    // const response = yield call(getEmployeesAPI, {
    //   params: params.pages,
    //   state: state,
    // });
    yield put({ type: EMPLOYEES_RECEIVED, payload: response });
  } catch (error) {
    console.log(error);
    let err = { ...error };
    if (err.response.status == 401) {
      this.props.history.push({
        pathname: "/login",
      });
    }
  }
}

function* addEmployee(params) {
  const state = yield select(),
    { newEmp } = params;
  console.log(newEmp);
  try {
    const response = yield call(() =>
      axios.post(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/`,
        newEmp,
        tokenConfig(state)
      )
    );

    yield put({ type: EMPLOYEE_ADDED, payload: response.data });
    yield put({ type: SHOW_NOTI });
    yield put({
      type: ADD_NOTIFICATION,
      notification: NOTI_SUCCESS,
    });
    yield put({
      type: GET_EMPLOYEES_BY_SHOP,
      pages: newEmp.pages,
    });
  } catch (error) {
    console.log(error.response);
  }
}

function* updateEmployee(params) {
  const state = yield select();
  console.log(params.newEmp.id);
  try {
    const response = yield call(() =>
      axios.put(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/${params.newEmp.id}`,
        params.newEmp,
        tokenConfig(state)
      )
    );

    yield put({ type: EMPLOYEE_UPDATED, payload: response.data });
  } catch (error) {
    console.log(error.response);
  }
}

function* deleteEmployee(params) {
  const state = yield select();
  try {
    yield call(() =>
      axios.delete(
        `${process.env.REACT_APP_BACKEND_EMPLOYEE}/api/employee/${params.id}`,
        tokenConfig(state)
      )
    );

    yield put({ type: EMPLOYEE_DELETED, payload: { id: params.id } });
  } catch (error) {
    console.log(error.response);
  }
}

export default function* sEmployeeSaga() {
  yield takeEvery(GET_EMPLOYEES, fetchEmployees);
  yield takeEvery(GET_EMPLOYEE_BY_ID, fetchEmpById);
  yield takeEvery(GET_EMPLOYEES_BY_SHOP, fetchEmployeesByShop);
  yield takeEvery(ADD_EMPLOYEE, addEmployee);
  yield takeEvery(UPDATE_EMPLOYEE, updateEmployee);
  yield takeEvery(DELETE_EMPLOYEE, deleteEmployee);
}
