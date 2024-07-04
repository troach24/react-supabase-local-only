import './App.css'
import { useState, useEffect } from 'react';
import { usePowerSync, useQuery } from "@powersync/react";
import { PowerSync } from './powersync/powersync';
import Logger from 'js-logger';


function App() {
  Logger.useDefaults();
  usePowerSync();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    PowerSync.getAll('SELECT * from customers').then(setCustomers)
  }, []);

  return <ul>
    {customers.map(customer => <li key={customer.id}>{customer.name}</li>)}
  </ul>
}

export default App
