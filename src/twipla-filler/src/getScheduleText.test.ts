import dayjs from 'dayjs';
import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest';
import {
  getScheduleText,
  timeRegexText,
  time,
  timeRegex as trg,
  yearNumber,
  youbi,
  monthNumber,
  dayNumber,
  spacer,
  isArray,
  convertYmdToDayjsObject,
  getTimeText,
} from './getScheduleText';

describe('convertYmdToDayjsObject', () => {
  it('should return dayjs object', () => {
    const result = convertYmdToDayjsObject({
      year: '2021',
      month: '01',
      date: '01',
    });
    expect(result.isValid()).toBe(true);
    expect(result.format('YYYY/MM/DD')).toBe('2021/01/01');
  });
});
describe('getScheduleText', () => {
  beforeEach(() => {
    vi.useFakeTimers({
      now: new Date('2021-10-01T00:00:00.000Z'),
    });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  const isSingleValue = (
    result: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs] | null
  ): result is dayjs.Dayjs => {
    expect(result).not.toBeNull();
    if (result === null) {
      throw new Error('result is null');
    }
    if (isArray(result)) {
      throw new Error('result is not array');
    }
    return true;
  };
  const formatResult = (result: dayjs.Dayjs) =>
    result.format('YYYY/MM/DD HH:mm');
  describe('japanese', () => {
    it('should return 2022/10/31 on 2022年10月31日', () => {
      const text = '2022年10月31日';
      const result = getScheduleText(text);
      if (!isSingleValue(result)) {
        throw new Error('result is not single value');
      }
      const date = formatResult(result);
      expect(date).toBe('2022/10/31 00:00');
    });
    it('should return 2021/10/31 on 10月31日', () => {
      const text = '10月31日';
      const result = getScheduleText(text);
      if (!isSingleValue(result)) {
        throw new Error('result is not single value');
      }
      const date = formatResult(result);
      expect(date).toBe('2021/10/31 00:00');
    });
    it('should return 2022/09/30 on ９月３０日', () => {
      const text = '９月３０日';
      const result = getScheduleText(text);
      if (!isSingleValue(result)) {
        throw new Error('result is not single value');
      }
      const date = formatResult(result);
      expect(date).toBe('2022/09/30 00:00');
    });
    it('should return [2022/09/29, 2022/09/30] on 9月29日 ～ 9月30日', () => {
      const text = '9月29日 ～ 9月30日';
      const result = getScheduleText(text);
      expect(result).not.toBeNull();
      if (result === null) {
        throw new Error('result is null');
      }
      expect(isArray(result)).toBe(true);
      if (!isArray(result)) {
        throw new Error('result is not array');
      }
      const date1 = formatResult(result[0]);
      const date2 = formatResult(result[1]);
      expect(date1).toBe('2022/09/29 00:00');
      expect(date2).toBe('2022/09/30 00:00');
    });
    it('should return [2022/09/29 12:00, 2022/09/29 16:00] on 9/29 12:00 - 16:00', () => {
      const text = '9/29 12:00 - 16:00';
      const result = getScheduleText(text);
      expect(result).not.toBeNull();
      if (result === null) {
        throw new Error('result is null');
      }
      expect(isArray(result)).toBe(true);
      if (!isArray(result)) {
        throw new Error('result is not array');
      }
      const date1 = formatResult(result[0]);
      const date2 = formatResult(result[1]);
      expect(date1).toBe('2022/09/29 12:00');
      expect(date2).toBe('2022/09/29 16:00');
    });
    it('should return [2022/09/29 12:30, 2022/09/29 19:00] on  9月29日 12時30分～19時', () => {
      const text = '9月29日 12時30分～19時';
      const result = getScheduleText(text);
      expect(result).not.toBeNull();
      if (result === null) {
        throw new Error('result is null');
      }
      expect(isArray(result)).toBe(true);
      if (!isArray(result)) {
        throw new Error('result is not array');
      }
      const date1 = formatResult(result[0]);
      const date2 = formatResult(result[1]);
      expect(date1).toBe('2022/09/29 12:30');
      expect(date2).toBe('2022/09/29 19:00');
    });
  });
});

describe('yearNumber', () => {
  const yearNumberRegex = new RegExp(yearNumber);
  it('matches 2022 to year', () => {
    const match = yearNumberRegex.exec('2022');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('2022');
  });
  it('matches ２０２２ to year', () => {
    const match = yearNumberRegex.exec('２０２２');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('２０２２');
  });
  it('not matches ２０２ to year', () => {
    const match = yearNumberRegex.exec('２０２');
    expect(match).toBeNull();
  });
});
describe('monthNumber', () => {
  const monthNumberRegex = new RegExp(monthNumber);
  it('matches 10 to month', () => {
    const match = monthNumberRegex.exec('10');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('10');
  });
  it('matches １０ to month', () => {
    const match = monthNumberRegex.exec('１０');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('１０');
  });
  it('matches 1 to month', () => {
    const match = monthNumberRegex.exec('1');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('1');
  });
});
describe('spacer', () => {
  const spacerRegex = new RegExp(spacer);
  it('matches space to spacer', () => {
    const match = spacerRegex.exec(' ');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe(' ');
  });
  it('matches full-width space to spacer', () => {
    const match = spacerRegex.exec('　');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('　');
  });
});

describe('dayNumber', () => {
  const dayNumberRegex = new RegExp(dayNumber);
  it('matches 31 to day', () => {
    const match = dayNumberRegex.exec('31');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('31');
  });
  it('matches １０ to day', () => {
    const match = dayNumberRegex.exec('１０');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('１０');
  });
  it('matches 1 to day', () => {
    const match = dayNumberRegex.exec('1');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('1');
  });
});

describe('youbi', () => {
  const youbiRegex = new RegExp(youbi);
  /*it('matches 月 to youbi', () => {
    const match = youbiRegex.exec('月');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('月');
  });
  it('matches 火 to youbi', () => {
    const match = youbiRegex.exec('火');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('火');
  });
  it('matches 水 to youbi', () => {
    const match = youbiRegex.exec('水');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('水');
  });
  it('matches 木 to youbi', () => {
    const match = youbiRegex.exec('木');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('木');
  });
  it('matches 金 to youbi', () => {
    const match = youbiRegex.exec('金');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('金');
  });
  it('matches 土 to youbi', () => {
    const match = youbiRegex.exec('土');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('土');
  });
  it('matches 日 to youbi', () => {
    const match = youbiRegex.exec('日');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('日');
  });*/
  it('matches (日) to youbi', () => {
    const match = youbiRegex.exec('(日)');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('(日)');
  });
});

describe('getTimeText', () => {
  const formatTime = (t: dayjs.Dayjs | [dayjs.Dayjs, dayjs.Dayjs]): string => {
    if (isArray(t)) {
      return `${formatTime(t[0])} - ${formatTime(t[1])}`;
    }
    return t.format('HH:mm');
  };
  it('matches 12:00 to time', () => {
    const match = getTimeText('12:00');
    expect(match).not.toBeNull();
    if (match === null) {
      throw new Error('match is null');
    }
    if (isArray(match)) {
      throw new Error('match is array');
    }
    const timeText = formatTime(match);
    expect(timeText).toBe('12:00');
  });
  it('matches 12時30分～19時 to time', () => {
    const match = getTimeText('12時30分～19時');
    expect(match).not.toBeNull();
    if (match === null) {
      throw new Error('match is null');
    }
    if (!isArray(match)) {
      throw new Error('match is not array');
    }
    const timeText = formatTime(match);
    expect(timeText).toBe('12:30 - 19:00');
  });
});

describe('timeRegexText', () => {
  const timeRegex = new RegExp(timeRegexText);
  it('matches 12:00 to time', () => {
    const match = timeRegex.exec('12:00');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('12:00');
    expect(match?.at(1)).toBe('12');
    expect(match?.at(2)).toBe('00');
  });
});

describe('time', () => {
  //const timeRegex = new RegExp(time);
  const timeRegex = trg;
  it('matches 12:00 to time', () => {
    const match = timeRegex.exec('12:00');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('12:00');
  });
  it('matches 12時 to time', () => {
    const match = timeRegex.exec('12時');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('12時');
  });
  it('matches 12時～19時 to time', () => {
    const match = timeRegex.exec('12時～19時');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('12時～19時');
    expect(match?.at(1)).toBe('12');
    expect(match?.at(5)).toBe('19');
  });
  it('matches 12時30分～19時 to time', () => {
    const match = timeRegex.exec('12時30分～19時');
    expect(match).not.toBeNull();
    expect(match?.at(0)).toBe('12時30分～19時');
    expect(match?.at(1)).toBe('12');
    expect(match?.at(2)).toBe('30');
    expect(match?.at(5)).toBe('19');
  });
});
