import { post } from './HTTPService.js';

const ENDPOINTS = {
  CREATE: 'events/create',
  FIND: 'events/find'
}

export const createEvent = async (event) => {
  const response = await post(ENDPOINTS.CREATE, event);
  return response;
}

export const findEvent = async (id) => {
  const response = await post(ENDPOINTS.FIND, { id });
  return response;
}