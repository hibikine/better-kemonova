import '../css/content.css';
import defaultImage from '../img/default.png';
import { processRequest } from '../twipla-filler/src/addTwiplaListener';

new MutationObserver(() => {
  const eventUrlElement =
    document.querySelector<HTMLInputElement>('.event_url');
  if (eventUrlElement == null) return;
  const EVENT_CALLBACK_ATTRIBUTE = 'data-kemonova-plus-url-listener';
  if (eventUrlElement.getAttribute(EVENT_CALLBACK_ATTRIBUTE)) {
    return;
  }
  eventUrlElement.setAttribute(EVENT_CALLBACK_ATTRIBUTE, 'true');
  eventUrlElement.addEventListener('blur', async (e) => {
    const value = (e.target as HTMLInputElement).value;
    const response = await chrome.runtime.sendMessage({
      type: 'fetchTwipla',
      url: value,
    });
    console.log(response);
    if (response == null) {
      return;
    }
    if (!('requests' in response)) {
      return;
    }
    if (!Array.isArray(response.requests)) {
      return;
    }
    response.requests.forEach(processRequest);
  });
}).observe(document.getElementById('modal_contents') ?? document.body, {
  subtree: true,
  childList: true,
});

chrome.storage.sync.get('colorTheme').then((res) => {
  if (res['colorTheme'] == null) {
    return;
  }
  if (['light', 'dark'].includes(res['colorTheme'])) {
    document.body.setAttribute('data-better-kemonova-theme', res['colorTheme']);
  } else {
    document.body.removeAttribute('data-better-kemonova-theme');
  }
});

chrome.storage.sync.get('fontSize').then((res) => {
  if (res['fontSize'] == null) {
    return;
  }
  const html = document.querySelector('html');
  if (['small', 'medium', 'large'].includes(res['fontSize'])) {
    html?.setAttribute('data-better-kemonova-font-size', res['fontSize']);
  } else {
    html?.removeAttribute('data-better-kemonova-font-size');
  }
});

// 画像がない場合にデフォルト画像を表示する
const noImageSrc = chrome.runtime.getURL(defaultImage);
Array.from(
  document.querySelectorAll<HTMLImageElement>('img.twitter_profile')
).forEach((item) => {
  const img = new Image();
  img.src = item.src;

  if (img.height === 0) {
    console.log('err');
    item.src = noImageSrc;
  }
});

const applyTranslate = <T extends Element & { innerText: string }>(
  selectors: string,
  translate: Map<string, string>
) => {
  Array.from(document.querySelectorAll<T>(selectors)).forEach((item, i) => {
    const text = translate.get(item.innerText);
    if (text !== undefined) {
      item.innerText = text;
    }
  });
};

// translate header
const headerSelectors = '.site_explanation > *';
const headerText = new Map([
  ['About\u00A0Service', 'サービスについて'],
  ['Site\u00A0Map', 'サイトマップ'],
  ["What's\u00A0New", '更新情報'],
  ['Contact\u00A0us', 'お問い合わせ'],
  ['Site\u00A0Link', 'リンク集'],
]);

// Main menu
const menuSelectors = '.tab_menu > .tab_btns > *';
const menuText = new Map([
  ['EVENT', 'イベント'],
  ['STUDIO', 'スタジオ'],
  ['CIRCLE', 'サークル'],
]);

// Powered
const poweredSelectors = '.powered > *';
const powered = new Map([
  ['Official Account ', '公式アカウント'],
  ['Managed by ', '管理人：'],
  [' is Patreon Support', '：Patreon サポート'],
]);

// Translate
(
  [
    [headerSelectors, headerText],
    [menuSelectors, menuText],
    [poweredSelectors, powered],
  ] as [selectors: string, translate: Map<string, string>][]
).forEach(([selectors, translate]) => applyTranslate(selectors, translate));

// Translate 新着情報
const hotText = ['New Arrival', '新着情報'];
const hotItem = document.querySelector<HTMLDivElement>('.hot');
if (hotItem && hotItem.innerText === hotText[0]) {
  hotItem.innerText = hotText[1];
}

const dateText = new Map([
  ['Mon', '月'],
  ['Tue', '火'],
  ['Wed', '水'],
  ['Thu', '木'],
  ['Fri', '金'],
  ['Sat', '土'],
  ['Sun', '日'],
] as const);
Array.from(document.querySelectorAll<HTMLDivElement>('.hot'))
  .filter((i) => i.innerText.startsWith('Now\u00A0Date'))
  .forEach((item) => {
    item.innerText = Array.from(dateText.keys()).reduce(
      (text, date) => text.replace(date, dateText.get(date)!),
      item.innerText.replace(/^Now\u00A0Date/gi, '本日')
    );
  });
