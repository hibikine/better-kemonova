import { MessageRequest } from './messageRequest';
import requestTypes from './requestTypes';
export const processRequest = (request: MessageRequest) => {
  if (request.type === requestTypes[0]) {
    const title = document.querySelector<HTMLInputElement>(
      'input.register_contents_input.event_name'
    );
    if (!title) {
      return;
    }
    if (title.value !== '') {
      return;
    }
    title.value = request.value;
    return;
  }
  if (request.type === requestTypes[1]) {
    const startDate =
      document.querySelector<HTMLInputElement>('input.start_date');
    if (!startDate) {
      return;
    }
    if (startDate.value !== '') {
      return;
    }
    startDate.value = request.value;
    return;
  }
  if (request.type === requestTypes[2]) {
    const startTime =
      document.querySelector<HTMLInputElement>('select.start_time');
    if (!startTime) {
      return;
    }
    if (startTime.value !== '1000') {
      return;
    }
    startTime.value = request.value;
    return;
  }
  if (request.type === requestTypes[3]) {
    const endDate = document.querySelector<HTMLInputElement>('input.end_date');
    if (!endDate) {
      return;
    }
    if (endDate.value !== '') {
      return;
    }

    endDate.value = request.value;
    return;
  }
  if (request.type === requestTypes[4]) {
    const endTime = document.querySelector<HTMLInputElement>('select.end_time');
    if (!endTime) {
      return;
    }
    if (endTime.value !== '1800') {
      return;
    }
    endTime.value = request.value;
    return;
  }
  if (request.type === requestTypes[5]) {
    const facilityName = document.querySelector<HTMLInputElement>(
      'input.facility_name'
    );
    if (!facilityName) {
      return;
    }
    if (facilityName.value !== '') {
      return;
    }
    facilityName.value = request.value;
    return;
  }
  if (request.type === requestTypes[6]) {
    const venueUrl =
      document.querySelector<HTMLInputElement>('input.venue_url');
    if (!venueUrl) {
      return;
    }
    if (venueUrl.value !== '') {
      return;
    }
    venueUrl.value = request.value;
    return;
  }
  if (request.type === requestTypes[7]) {
    const eventUrl =
      document.querySelector<HTMLInputElement>('input.event_url');
    if (!eventUrl) {
      return;
    }
    // skip
    //eventUrl.value = request.value;
    return;
  }
  if (request.type === requestTypes[8]) {
    const accountUrl =
      document.querySelector<HTMLInputElement>('input.account_url');
    if (!accountUrl) {
      return;
    }
    if (accountUrl.value !== '') {
      return;
    }
    accountUrl.value = request.value;
    return;
  }
};
export const addTwiplaListener = () => {
  chrome.runtime.onMessage.addListener(
    (request: MessageRequest, _sender, _sendResponse) => {
      processRequest(request);
    }
  );
};
