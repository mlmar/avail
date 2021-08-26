import { get, post } from '../service/HTTPService.js';

const ENDPOINTS = {
  ADD: 'events/create'
}

export const createEvent = async (event) => {
  const response = await post(ENDPOINTS.ADD, event);
  return response;
}