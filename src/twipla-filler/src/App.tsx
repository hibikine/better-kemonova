import * as React from 'react';
import { ShowTwiplaForm } from './ShowTwiplaForm';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShowTwiplaForm />
    </QueryClientProvider>
  );
}

export default App;
