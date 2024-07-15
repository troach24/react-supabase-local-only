import { Column, ColumnType, Schema, Table, PowerSyncDatabase } from '@powersync/web';

/**
 * A placeholder connector which doesn't do anything.
 * This is just used to verify that the sync workers can be loaded
 * when connecting.
 */
export class PowerSyncConnector {
  async fetchCredentials() {
    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      token: import.meta.env.POWERSYNC_DEV_TOKEN
    };
  }

  async uploadData() {}
}

export const AppSchema = new Schema([
  new Table(
    {
      name: 'customers',
      columns: [
        new Column(
          { name: 'name', type: ColumnType.TEXT }
        ),
        new Column(
          { name: 'location', type: ColumnType.TEXT }
        ),
        new Column(
          { name: 'owner_id', type: ColumnType.TEXT }
        ),
      ]
    }
  ),
  new Table(
    {
      name: 'users',
      columns: [
        new Column(
          { name: 'name', type: ColumnType.TEXT }
        ),
      ]
    }
  )
]);

export let PowerSync: PowerSyncDatabase;

export const databaseConnecter = async () => {
  PowerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: { dbFilename: 'test.sqlite' }
  });

  await PowerSync.init();

  console.log(
    `Attempting to connect in order to verify web workers are correctly loaded.
    This doesn't use any actual network credentials.
    Network errors will be shown: these can be ignored.`
  );
  return PowerSync;
};

export async function insertCustomer(customer: { name: string, location: string }, uuid: string) {
  await PowerSync.execute('INSERT INTO customers(id, name, location, owner_id) VALUES(uuid(), ?, ?, ?)', [customer.name, customer.location, uuid]);
}

export async function insertUser(user: { name: string}) {
  await PowerSync.execute('INSERT INTO users(id, name) VALUES(uuid(), ?)', [user.name]);
}
