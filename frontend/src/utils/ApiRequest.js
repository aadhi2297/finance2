// src/utils/ApiRequest.js
export const host = "http://127.0.0.1:5000"; // backend

// =================== AUTH ===================
export const registerAPI = `${host}/api/v1/users/register`;
export const loginAPI = `${host}/api/v1/users/login`;
export const setAvatarAPI = `${host}/api/v1/users/setAvatar`;

// =================== TRANSACTIONS ===================
export const addTransactionAPI = `${host}/api/v1/transactions/addTransaction`;
export const getTransactionsAPI = `${host}/api/v1/transactions/getTransactions`;

// ✅ make these functions that append the ID
export const updateTransactionAPI = (id) =>
  `${host}/api/v1/transactions/updateTransaction/${id}`;
export const deleteTransactionAPI = (id) =>
  `${host}/api/v1/transactions/deleteTransaction/${id}`;
