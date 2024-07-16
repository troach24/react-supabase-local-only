import "./App.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import { useQuery, PowerSyncContext } from "@powersync/react";
import { databaseConnecter, insertLocalCustomer, insertCustomer, insertUser, PowerSyncConnector } from "./powersync/powersync";
import { PowerSyncDatabase } from "@powersync/web";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Logger from "js-logger";
import { useEffect, useState } from "react";

function App() {
  Logger.useDefaults();
  const [database, setDatabase] = useState<PowerSyncDatabase | null>(
    null
  );
  const [user, setUser] = useState<{ id: string, name: string } | null>(null);
  const [connection, setConnection] = useState("Local-Only");
  const [customersTableName, setCustomersTableName] = useState("");

  useEffect(() => {
    (async () => {
      setDatabase(await databaseConnecter());
    })();
  }, []);

  if (!database) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PowerSyncContext.Provider value={database} />
      <DBSwitch
        db={database}
        connection={connection}
        setConnection={setConnection}
        customersTableName={customersTableName}
        setCustomersTableName={setCustomersTableName}
        />
      <User
        connection={connection}
        user={user}
        setUser={setUser}
        />
      <Customers
        connection={connection}
        customersTableName={customersTableName}
      />
      <CustomerInput
        user={user}
        connection={connection}
      />
    </>
  );
}

export const DBSwitch = (props: { db: { connect: (arg0: PowerSyncConnector) => void; disconnect: () => void; }, connection: string, setConnection: React.Dispatch<React.SetStateAction<string>>, customersTableName: string, setCustomersTableName: React.Dispatch<React.SetStateAction<string>> }) => {
  const switchDB = (dbString: string) => {
    console.log(`Clicked ${dbString}`);
    props.setConnection(dbString);
    if (dbString === 'PowerSync') {
      props.db.connect(new PowerSyncConnector());
      props.setCustomersTableName("customers");
    } else {
      props.db.disconnect();
      props.setCustomersTableName("local_customers");
    }
  }
  
  return (
    <>
      <p>Connection: {props.connection}</p>
      <button type="button" onClick={() => switchDB('Local-Only')} style={{ 'marginTop': '10px' }}>
        Local-Only
      </button>
      <button type="button" onClick={() => switchDB('PowerSync')} style={{ 'marginTop': '10px' }}>
        PowerSync
      </button>
    </>
  )
}

export const User = (props: { connection: string, user: any, setUser: any }) => {
  const { data: users, error, isLoading } = useQuery("SELECT * from users LIMIT 1");
  const createUser = () => {
    insertUser({ name: 'Travis' });
  }
  const updateUser = (key: string, value: string) => {
    props.setUser(() => ({
      id: key,
      name: value,
    }));
  };

  console.log("users component rendering...");
  if (error) {
    console.error("Error fetching users:", error);
  } else if (isLoading) {
    // console.log("Loading users...");
  } else if (!props.user && users[0]) {
    // console.log('SET user...');
    updateUser(users[0].id, users[0].name);
  } else if (users && users.length === 0) {
    console.log('create user...', users.length);
    createUser();
  }
  console.log("user:", props.user);
  
  return (
    <></>
  )
}

export const Customers = (props: { connection: string, customersTableName: string }) => {
  const { data: customers, error, isLoading } = useQuery(`SELECT * from ${props.customersTableName}`);
  
  if (!import.meta.env.VITE_POWERSYNC_URL) {
    console.log(`issue with powersync URL`);
  }
  console.log(`${props.customersTableName} component rendering...`);
  if (error) {
    console.error("Error fetching customers:", error);
  } else if (isLoading) {
    console.log("Loading customers...");
  } else {
    console.log("customers:", customers);
  }

  if (!customers || customers && customers.length === 0) {
    return (
      <>
        <h3>No Existing Customers</h3>
      </>
    );
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

export const CustomerInput = (props: { user: any, connection: string }) => {
  const [newName, setName] = useState("");
  const [newLocation, setLocation] = useState("");
  
  const handleCustomerNameInput = (event) => {
    setName(event.target.value);
  }
  
  const handleCustomerLocationInput = (event) => {
    setLocation(event.target.value);
  }
  
  const addCustomer = () => {
    if (props.connection === 'PowerSync') {
      insertCustomer({ name: newName, location: newLocation }, props.user.id);
    } else {
      insertLocalCustomer({ name: newName, location: newLocation }, props.user.id);
    }
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
