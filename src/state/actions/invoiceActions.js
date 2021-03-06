import {
  GET_INVOICES,
  ADD_INVOICE,
  DELETE_INVOICE,
  UPDATE_INVOICE,
  GET_ALL_INVOICES,
} from "./types";

export const getInvoices = (params) => ({
  type: GET_INVOICES,
  pages: params,
});

export const getAllInvoices = (query) => ({
  type: GET_ALL_INVOICES,
  query: query,
});

export const deleteInvoice = (id) => ({
  type: DELETE_INVOICE,
  id: id,
});
export const addInvoice = (newInvoice) => ({
  type: ADD_INVOICE,
  newInvoice: newInvoice,
});

export const updateInvoice = (newInvoice) => ({
  type: UPDATE_INVOICE,
  newInvoice: newInvoice,
});

// export const getInvoices = (show = 5, page = 1, query) => (
//   dispatch,
//   getState
// ) => {
//   let newQuery = "";
//   if (query === "") newQuery = "undefined";
//   else newQuery = query;
//   axios
//     .get(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/invoice/${show}/${page}/${newQuery}`,
//       tokenConfig(getState)
//     )

//     .then(response => dispatch({ type: GET_INVOICES, payload: response.data }))
//     .catch(er => console.log(er.response));
// };

// export const deleteInvoice = id => (dispatch, getState) => {
//   axios
//     .delete(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/invoice/${id}`,
//       tokenConfig(getState)
//     )
//     .then(response => {
//       dispatch({
//         type: DELETE_INVOICE,
//         payload: response.data
//       });
//     });
// };

// export const addInvoice = newInvoice => (dispatch, getState) => {
//   axios
//     .post(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/invoice/`,
//       newInvoice,
//       tokenConfig(getState)
//     )
//     .then(response => {
//       dispatch({
//         type: ADD_INVOICE,
//         payload: newInvoice,
//         response: response.status
//       });
//     });
// };

// export const updateInvoice = newInvoice => (dispatch, getState) => {
//   axios
//     .put(
//       `${process.env.REACT_APP_BACKEND_HOST}/api/invoice/${newInvoice._id}`,
//       newInvoice,
//       tokenConfig(getState)
//     )

//     .then(response => {
//       dispatch({
//         type: UPDATE_INVOICE,
//         payload: response.data
//       });
//     })
//     .catch(error => {
//       console.log(error.response);
//     });
// };
// export const getAllInvoices = query => dispatch => {
//   let newQuery = "";
//   if (query === "") newQuery = "undefined";
//   else newQuery = query;

//   axios
//     .get(`${process.env.REACT_APP_BACKEND_HOST}/api/invoice/getall/${newQuery}`)
//     .then(response =>
//       dispatch({ type: GET_ALL_INVOICES, payload: response.data })
//     )
//     .catch(er => console.log(er.response));
// };
