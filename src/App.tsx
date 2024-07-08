import './App.css';
import { useState, useEffect } from 'react';
import { usePowerSync, useQuery } from "@powersync/react";
import { PowerSync, openDatabase, insertCustomer } from './powersync/powersync';
import Logger from 'js-logger';


function App() {
  Logger.useDefaults();
  usePowerSync();

  // const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const initializeDatabase = async () => {
      await openDatabase();
      // const customers = await PowerSync.getAll('SELECT * from customers');
      // setCustomers(customers);
    };
    initializeDatabase();
  }, []);

  const { data: customers } = useQuery(`
    SELECT * from customers
  `);

  return <>
    <ul>
      {customers.map(customer => <li key={customer.id}>{customer.name}</li>)}
    </ul>
    <button type="button" onClick={() => insertCustomer()}>New Customer</button>
  </>
}

export default App
