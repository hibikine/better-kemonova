import * as React from 'react';
import { Suspense } from 'react';
import TwiplaForm from './TwiplaForm';
export function ShowTwiplaForm() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <TwiplaForm />
    </Suspense>
  );
}
