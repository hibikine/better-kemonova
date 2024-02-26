import { useEffect, useState } from 'react';

export const useCurrentTab = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
  useEffect(() => {
    const callback: OnUpdatedCallback = (_tabId, changeInfo, tab) => {
      if (changeInfo.status === 'complete') {
        setTab(tab ?? null);
      }
    };
    chrome.tabs.onUpdated.addListener(callback);
    return () => chrome.tabs.onUpdated.removeListener(callback);
  }, []);
  useEffect(() => {
    (async () => {
      const tab = await getCurrentTab();
      setTab(tab);
    })();
  }, []);
  return tab;
};
async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
type OnUpdatedCallback = Parameters<
  typeof chrome.tabs.onUpdated.addListener
>[0];
