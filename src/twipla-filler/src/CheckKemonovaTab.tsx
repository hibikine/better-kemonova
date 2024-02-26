import * as React from 'react';
import { FC, ReactNode, TableHTMLAttributes } from 'react';
import { z } from 'zod';

const kemonovaUrl = z.string().url().startsWith('https://kemonova.jp');
type Props = {
  children: ReactNode;
  tab: chrome.tabs.Tab | null;
};
const CheckKemonovaTab: FC<Props> = ({ children, tab }) => {
  const isKemonovaTab = tab ? kemonovaUrl.safeParse(tab.url).success : false;
  return (
    <>
      {isKemonovaTab ? children : <p>現在のタブはKemonovaではありません。</p>}
    </>
  );
};

export default CheckKemonovaTab;
