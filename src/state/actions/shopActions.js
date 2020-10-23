import { GET_SHOPS, ADD_SHOP, DELETE_SHOP, UPDATE_SHOP } from './types';

export const getShops = (params) => ({
  type: GET_SHOPS,
  pages: params,
});

export const deleteShop = (id) => ({
  type: DELETE_SHOP,
  id: id,
});

export const addShop = (newShop) => ({
  type: ADD_SHOP,
  newShop: newShop,
});

export const updateShop = (newShop) => ({
  type: UPDATE_SHOP,
  newShop: newShop,
});