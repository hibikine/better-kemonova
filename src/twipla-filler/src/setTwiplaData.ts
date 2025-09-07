import { CheerioAPI, load } from 'cheerio';
import dayjs from 'dayjs';
import { z } from 'zod';
import { getScheduleText, getTimeText, isArray } from './getScheduleText';
import { MessageRequest } from './messageRequest';
import requestTypes from './requestTypes';
import { twiplaUrl } from './schemas';

const nullOrWrap = <T extends unknown>(value: T | null): [T] | null =>
  value ? [value] : null;
export const firstNotNull = <T extends unknown>(
  ...args: (T | null)[]
): [T] | [] =>
  nullOrWrap<T>(
    args.find((arg): arg is Exclude<typeof arg, null> => arg !== null) ?? null
  ) ?? [];

export const fetchTwipla = async (url: string) => {
  const response = await fetch(url);
  const text = await response.text();
  console.log(response);
  console.log(text);
  return load(text);
};

export const getMergedTimes = (
  times: (dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs])[]
): dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | undefined => {
  const first = times[0];
  if (typeof first === 'undefined') {
    return;
  }
  if (isArray(first)) {
    return first;
  }
  const startEndTime = times.find((time) => isArray(time)) as [
    dayjs.Dayjs,
    dayjs.Dayjs
  ];
  if (typeof startEndTime === 'undefined') {
    return first;
  }
  return [
    dayjs(first).hour(startEndTime[0].hour()).minute(startEndTime[0].minute()),
    dayjs(first).hour(startEndTime[1].hour()).minute(startEndTime[1].minute()),
  ];
};

export const fixMinutes = (time: dayjs.Dayjs): dayjs.Dayjs => {
  if ([0, 30].includes(time.minute())) {
    return time;
  }
  if (time.minute() < 30) {
    return time.minute(0);
  }
  return time.minute(30);
};

export const setTimeDate = <T extends dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs]>(
  time: T,
  date: dayjs.Dayjs
): T => {
  if (isArray(time)) {
    return [setTimeDate(time[0], date), setTimeDate(time[1], date)] as T;
  }
  return time.year(date.year()).month(date.month()).date(date.date()) as T;
};

export const schema = z.object({
  url: twiplaUrl,
});

export const setTwiplaData =
  (tab: null) =>
  async ({ url }: { url: string }): Promise<MessageRequest[]> => {
    /*if (tab === null) {
      return Promise.reject();
    }*/
    console.log(url);
    const resultData: MessageRequest[] = [];
    const sendMessage = (
      tab: null,
      type: (typeof requestTypes)[number],
      value: any
    ) => {
      const titleMessage: MessageRequest = { type, value };
      /*if (typeof tab.id !== 'number') {
        return;
      }*/
      resultData.push(titleMessage);
      // chrome.tabs.sendMessage(tab.id, titleMessage);
    };
    const sendTime = (
      tab: null,
      time: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs]
    ) => {
      if (isArray(time)) {
        const [start, end] = time;
        sendMessage(tab, 'startDate', start.format('YYYY-MM-DD'));
        sendMessage(tab, 'startTime', fixMinutes(start).format('HHmm'));
        sendMessage(tab, 'endDate', end.format('YYYY-MM-DD'));
        sendMessage(tab, 'endTime', fixMinutes(end).format('HHmm'));
        return;
      }
      sendMessage(tab, 'startDate', time.format('YYYY-MM-DD'));
      sendMessage(tab, 'startTime', fixMinutes(time).format('HHmm'));
      sendMessage(tab, 'endDate', time.format('YYYY-MM-DD'));
    };

    if (twiplaUrl.safeParse(url).success) {
      const $ = await fetchTwipla(url);
      console.log($('h1').contents().text());

      const title = getTitle($);
      if (title !== '') {
        sendMessage(tab, 'title', title);
      }

      const [time, headerTime] = getTime($);
      if (time !== undefined) {
        sendTime(tab, time);
      } else if (headerTime !== null) {
        sendTime(tab, headerTime);
      }

      sendMessage(tab, 'eventUrl', url);

      const accountUrl = $('.arrow_box + p > a').first().attr('href');
      if (accountUrl) {
        const trimAccount = accountUrl.match(/[a-zA-Z_]+$/);
        if (trimAccount) {
          sendMessage(tab, 'accountUrl', trimAccount.at(0));
        }
      }
    }
    return resultData;
  };

function getTitle($: CheerioAPI): string {
  return $('h1')
    .contents()
    .filter(function () {
      return this.type === 'text';
    })
    .text();
}

function getTime(
  $: CheerioAPI
): [
  time: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | undefined,
  headerTime: dayjs.Dayjs | null
] {
  const headerTimeText = $('.arrow_box .largetext').text();
  const headerTime = getScheduleText(headerTimeText) as dayjs.Dayjs | null;
  const desc = $('.desc').text().split('\n');
  const times = desc.flatMap(
    (text): Exclude<ReturnType<typeof getScheduleText>, null>[] => {
      const date = getScheduleText(text);
      const time = getTimeText(text);
      if (time !== null) {
      }
      if (date === null && time === null) {
        return [];
      }
      if (headerTime === null) {
        if (time !== null && date !== null && isArray(time) && !isArray(date)) {
          return [setTimeDate(time, date)];
        }
        return firstNotNull(date, time);
      }
      if (date !== null) {
        if (isArray(date)) {
          if (headerTime.isSame(date[0], 'day')) {
            return [date];
          }
        } else if (headerTime.isSame(date, 'day')) {
          if (time !== null && isArray(time)) {
            return [setTimeDate(time, date)];
          }
          return [date];
        }
      }
      if (time !== null) {
        return [setTimeDate(time, headerTime)];
      }
      return [];
    }
  );
  const time = getMergedTimes(times);
  return [time, headerTime];
}
