import { AtomEffect } from 'recoil';

export const chromeStorageEffect =
  <T>(key: string, fallbackValue: T, onChange: (value: T) => void) =>
  (...args: Parameters<AtomEffect<T>>) => {
    const [{ onSet, setSelf }] = args;
    setSelf(
      chrome.storage.sync.get(key).then((res): T => {
        if (res[key] == null) {
          onChange(fallbackValue);
          return fallbackValue;
        }
        onChange(res[key]);
        return res[key];
      })
    );
    onSet((newValue) => {
      onChange(newValue);
      chrome.storage.sync.set({ [key]: newValue });
    });
  };
