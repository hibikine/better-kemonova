import * as React from 'react';
import { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { any, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CheckKemonovaTab from './CheckKemonovaTab';
import { twiplaUrl } from './schemas';
import { load } from 'cheerio';
import { useCurrentTab } from './useCurrentTab';
import { isArray } from './getScheduleText';
import { processRequest } from './addTwiplaListener';
import { setTwiplaData } from './setTwiplaData';
import { schema } from './setTwiplaData';

export default function TwiplaForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  //const tab = useCurrentTab();
  const tab = null;
  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    setTwiplaData(tab as any) as any,
    [tab]
  );
  watch('url');
  return (
    <div className="App w-80">
      <CheckKemonovaTab tab={tab}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            URL
            <input
              type="url"
              className="inline-block border ml-2 w-48"
              {...register('url', {
                required: true,
              })}
            />
          </label>
          {typeof errors.url?.message !== 'undefined' ? (
            <p>{errors.url.message as any}</p>
          ) : null}
          <input className="ml-2 border p-1" type="submit" value="入力" />
        </form>
      </CheckKemonovaTab>
    </div>
  );
}
