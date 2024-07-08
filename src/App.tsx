import './App.css';
import { useQuery, PowerSyncContext } from "@powersync/react";
import { openDatabase, insertCustomer } from './powersync/powersync';
import {PowerSyncDatabase} from '@powersync/web';
import Logger from 'js-logger';
import React, { useEffect } from 'react';

function App() {
  Logger.useDefaults();

  const [database, setDatabase] = React.useState<PowerSyncDatabase | null>(null);

  useEffect(() => {
    (async () => {
      setDatabase(await openDatabase());
    })()
  }, []);

  if (!database) {
    return <div>Loading...</div>
  }

  return <PowerSyncContext.Provider value={database}>
    <Component />
    <button type="button" onClick={() => insertCustomer()}>New Customer</button>
  </PowerSyncContext.Provider>
}

export const Component = () => {

  const { data: custs, error, isLoading } = useQuery('SELECT * from customers');

  console.log('component rendering');
  console.log('custs:', custs);
  if (error) {
    console.error('Error fetching customers:', error);
  }
  if (isLoading) {
    console.log('Loading customers...');
  }

  return <>
    <ul>
      <li key="foo">foo</li>
      {custs && custs.map((l) => (
        <li key={l.id}>{l.name}</li>))}
    </ul>
  </>
}

export default App