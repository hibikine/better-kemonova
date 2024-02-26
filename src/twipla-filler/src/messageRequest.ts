import type requestTypes from './requestTypes';
export type MessageRequest = {
  type: typeof requestTypes[number];
  value: any;
};
