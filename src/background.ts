import { setTwiplaData } from './twipla-filler/src/setTwiplaData';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) {
    return;
  }
  if (!('type' in message)) {
    return;
  }
  if (message.type !== 'fetchTwipla') {
    return;
  }
  if (!('url' in message)) {
    return;
  }
  if (typeof message.url !== 'string') {
    return;
  }
  setTwiplaData(null)(message).then((value) => {
    sendResponse({ requests: value });
  });
  return true;
});
