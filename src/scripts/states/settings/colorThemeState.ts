import { atom } from 'recoil';
import type { colorRadios } from '../../components/ColorSelector';
import { chromeStorageEffect } from './chromeStorageEffect';
const setColor = (newValue: (typeof colorRadios)[number]['value']) => {
  if (['light', 'dark'].includes(newValue))
    document.body.setAttribute('data-bs-theme', newValue);
  else document.body.removeAttribute('data-bs-theme');
};

export const colorThemeState = atom({
  key: 'colorThemeState',
  default: 'system' as (typeof colorRadios)[number]['value'],
  effects: [
    chromeStorageEffect<(typeof colorRadios)[number]['value']>(
      'colorTheme',
      'system',
      setColor
    ),
  ],
});
