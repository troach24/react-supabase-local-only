import "./App.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import { useQuery, PowerSyncContext } from "@powersync/react";
import { openDatabase, insertCustomer } from "./powersync/powersync";
import { PowerSyncDatabase } from "@powersync/web";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Logger from "js-logger";
import React, { useEffect, useState } from "react";

function App() {
  Logger.useDefaults();

  const [database, setDatabase] = React.useState<PowerSyncDatabase | null>(
    null
  );

  useEffect(() => {
    (async () => {
      setDatabase(await openDatabase());
    })();
  }, []);

  if (!database) {
    return <div>Loading...</div>;
  }

  return (
    <PowerSyncContext.Provider value={database}>
      <Customers />
      <CustomerInput />
    </PowerSyncContext.Provider>
  );
}

export const Customers = () => {
  const { data: customers, error, isLoading } = useQuery("SELECT * from customers");
  console.log("customers component rendering...");
  
  if (error) {
    console.error("Error fetching customers:", error);
  } else if (isLoading) {
    console.log("Loading customers...");
  } else {
    console.log("customers:", customers);
  }

  return (
    <>
      <h3>Existing Customers</h3>
      <ul>
        {customers && customers.map((customer) =>
          <li key={customer.id}>{customer.name} ({customer.location})</li>
        )}
      </ul>
    </>
  );
};

export const CustomerInput = () => {
  const [newName, setName] = useState("");
  const [newLocation, setLocation] = useState("");
  
  const handleCustomerNameInput = (event) => {
    setName(event.target.value);
  }
  
  const handleCustomerLocationInput = (event) => {
    setLocation(event.target.value);
  }
  
  const addCustomer = () => {
    insertCustomer({ name: newName, location: newLocation });
    setName("");
    setLocation("");
  }

  return (
    <>
      <br />
      <br />
      <h3>New Customer</h3>
      <TextField
        id="customer-name"
        label="Customer Name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle style={{ color: 'white' }} />
            </InputAdornment>
          ),
        }}
        value={newName}
        onChange={() => handleCustomerNameInput(event)}
        variant="standard"
        color="primary"
        sx={{
          label: { color: 'white' },
          input: { color: 'white' }
        }}
      />
      <br />
      <TextField
        id="customer-location"
        label="Customer Location"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AddLocationIcon style={{ color: 'white' }} />
            </InputAdornment>
          ),
        }}
        value={newLocation}
        onChange={() => handleCustomerLocationInput(event)}
        variant="standard"
        color="primary"
        sx={{
          label: { color: 'white' },
          input: { color: 'white' }
        }}
      />
      <br />
      <button type="button" onClick={() => addCustomer()} style={{ 'marginTop': '10px' }}>
        Add Customer
      </button>
    </>
  )
}

export default App;
