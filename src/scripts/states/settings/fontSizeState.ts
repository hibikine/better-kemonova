import { atom } from 'recoil';
import { chromeStorageEffect } from './chromeStorageEffect';
export const fontSizeState = atom({
  key: 'fontSizeState',
  default: 'medium',
  effects: [
    chromeStorageEffect('fontSize', 'medium', (newValue) => {
      if (['small', 'medium', 'large'].includes(newValue))
        document.body.setAttribute('data-font-size', newValue);
      else document.body.removeAttribute('data-font-size');
    }),
  ],
});
