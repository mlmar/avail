import { post } from './HTTPService.js';

const ENDPOINTS = {
  UPDATE: 'users/update',
}

export const updateUser = async (event) => {
  const response = await post(ENDPOINTS.UPDATE, event);
  return response;
}