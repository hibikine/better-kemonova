import { z } from 'zod';
export const twiplaUrl = z
  .string()
  .url()
  .startsWith('https://twipla.jp/events/')
  .regex(/^https:\/\/twipla.jp\/events\/\d+$/);
