import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
export const yearNumber = '[0-9０-９]{4}';
export const monthNumber = '[0-1０-１]?[0-9０-９]';
export const dayNumber = '[0-3０-３]?[0-9０-９]';
export const spacer = '[\\s　]*';
/** 1 paren */
const hyphen = '([ー～~―-]|から)';
const hourNumber = '[0-2０-２]?[0-9０-９]';
const minutesNumber = '[0-5０-５]?[0-9０-９]';
const youbiList = '日月火水木金土㈰㈪㈫㈬㈭㈮㈯';
const englishYoubiList = 'Sun|Mon|Tue|Wed|Thu|Fri|Sat';
export const youbi = `([([（［〈《]([${youbiList}]|${englishYoubiList})[)\\]）］》〉]|[$${youbiList}](曜日?)?)`;
const ymd = `((${yearNumber})${spacer}[年/-])?${spacer}(${monthNumber})${spacer}[月/-]${spacer}(${dayNumber})${spacer}日?${spacer}${youbi}?`;
/**
 * 2 parens
 */
export const time = `(${hourNumber})${spacer}[:時]${spacer}(${minutesNumber})?[分]?`;

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(objectSupport);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

const getNextDate = (month: string, date: string): dayjs.Dayjs => {
  const targetDate = dayjs(`${month}/${date}`, 'MM/DD');
  const now = dayjs();
  if (targetDate.isSameOrAfter(now)) {
    return targetDate;
  }
  return targetDate.add(1, 'year');
};

const convertNumeric = (str: string): string => {
  return str.replace(/[０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
  });
};

export const isArray = (
  arg: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs]
): arg is [dayjs.Dayjs, dayjs.Dayjs] => {
  return Array.isArray(arg);
};

type Ymdhm = {
  year: string;
  month: string;
  date: string;
  hours?: string;
  minutes?: string;
};

type YmdhmBuilder<T extends keyof Ymdhm = never> = {
  [P in T]: string;
};

const hasTime = (ymdhm: Ymdhm): boolean => {
  return (
    typeof ymdhm.hours !== 'undefined' || typeof ymdhm.minutes !== 'undefined'
  );
};

const setValue = (
  ymdhm: Ymdhm,
  target: keyof Ymdhm,
  value: string | undefined
) => {
  if (typeof value !== 'undefined') {
    ymdhm[target] = convertNumeric(value).padStart(2, '0');
  }
};

const setValueWithValidate = (
  ymdhm: Ymdhm,
  target: keyof Ymdhm,
  value: string | undefined,
  start?: Ymdhm
): boolean => {
  if (typeof value !== 'undefined') {
    setValue(ymdhm, target, value);
    return true;
  }

  if (typeof start !== 'undefined' && hasTime(ymdhm)) {
    setValue(ymdhm, target, start[target]);
    return true;
  }
  return false;
};

export const getYmdhm = (
  year: string | undefined,
  month: string | undefined,
  date: string | undefined,
  hours: string | undefined,
  minutes: string | undefined,
  start?: Ymdhm
): Ymdhm | null => {
  const ymdhm: Ymdhm = { date: '', month: '', year: '' };
  setValue(ymdhm, 'hours', hours);
  setValue(ymdhm, 'minutes', minutes);
  if (!setValueWithValidate(ymdhm, 'month', month, start)) {
    return null;
  }
  if (!setValueWithValidate(ymdhm, 'date', date, start)) {
    return null;
  }

  if (typeof year !== 'undefined') {
    ymdhm.year = convertNumeric(year);
  } else if (typeof start !== 'undefined') {
    ymdhm.year = start.year;
  } else {
    ymdhm.year = `${getNextDate(ymdhm.month, ymdhm.date).year()}`;
  }

  return ymdhm;
};

export const convertYmdToDayjsObject = (ymd: Ymdhm): dayjs.Dayjs => {
  const newYmd: { [key in keyof Ymdhm]: number } = {
    year: parseInt(ymd.year, 10),
    month: parseInt(ymd.month, 10) - 1,
    date: parseInt(ymd.date, 10),
  };
  if (typeof ymd.hours !== 'undefined') {
    newYmd.hours = parseInt(ymd.hours, 10);
  }
  if (typeof ymd.minutes !== 'undefined') {
    newYmd.minutes = parseInt(ymd.minutes, 10);
  }
  return dayjs(newYmd);
};

const convertStartAndEnd = (
  startYmd: Ymdhm | null,
  endYmd: Ymdhm | null
): dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null => {
  if (startYmd === null) {
    return null;
  }
  if (endYmd === null) {
    return convertYmdToDayjsObject(startYmd);
  }
  return [convertYmdToDayjsObject(startYmd), convertYmdToDayjsObject(endYmd)];
};

//export const timeRegexText = `${time}(${spacer}${hyphen}?${spacer}${time})?`;
export const timeRegexText = `([0-2０-２]?[0-9０-９])[\s　]*[:時][\s　]*([0-5０-５]?[0-9０-９])?([\s　]*([ー～~―-]|から)?[\s　]*([0-2０-２]?[0-9０-９])[\s　]*[:時][\s　]*([0-5０-５]?[0-9０-９])?)?`;
export const timeRegex =
  /([0-2０-２]?[0-9０-９])[\s　]*[:時][\s　]*([0-5０-５]?[0-9０-９])?[分]?([\s　]*([ー～~―-]|から)?[\s　]*([0-2０-２]?[0-9０-９])[\s　]*[:時][\s　]*([0-5０-５]?[0-9０-９])?[分]?)?/;
export const getTimeText = (
  text: string
): dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null => {
  const textRegex = timeRegex; // new RegExp(timeRegexText);
  const regexResult = textRegex.exec(text); // text.match(textRegex);
  if (regexResult === null) {
    return null;
  }
  const startYmd = getYmdhm('2020', '1', '1', regexResult[1], regexResult[2]);
  const endYmd = getYmdhm(
    '2020',
    undefined,
    undefined,
    regexResult[5],
    regexResult[6],
    startYmd ?? undefined
  );
  return convertStartAndEnd(startYmd, endYmd);
};
export const scheduleRegexText = `${ymd}(${spacer}${time})?(${spacer}${hyphen}?(${spacer}${ymd})?(${spacer}${time})?)?`;

export const getScheduleText = (
  text: string
): dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null => {
  const textRegex = new RegExp(scheduleRegexText);
  const regexResult = text.match(textRegex);
  if (regexResult === null) {
    return null;
  }
  const startYmd = getYmdhm(
    regexResult[2],
    regexResult[3],
    regexResult[4],
    regexResult[9],
    regexResult[10]
  );
  const endYmd = getYmdhm(
    regexResult[15],
    regexResult[16],
    regexResult[17],
    regexResult[22],
    regexResult[23],
    startYmd ?? undefined
  );

  return convertStartAndEnd(startYmd, endYmd);
};
