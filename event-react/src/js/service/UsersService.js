import { post } from './HTTPService.js';

const ENDPOINTS = {
  UPDATE: 'users/update',
  FIND: 'users/find',
  FIND_ONE: 'users/find-one'
}

export const updateUser = async (eventObj) => {
  const response = await post(ENDPOINTS.UPDATE, eventObj);
  return response;
}

export const findUsers = async (id) => {
  const response = await post(ENDPOINTS.FIND, { id });
  return response;
}

export const findUser = async(userObj) => {
  const response = await post(ENDPOINTS.FIND_ONE, userObj);
  return response;
}