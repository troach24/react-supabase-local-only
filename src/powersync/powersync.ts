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

  /**
   * Try and connect, this will setup shared sync workers
   * This will fail due to not having a valid endpoint,
   * but it will try - which is all that matters.
   */
  // await PowerSync.connect(new PowerSyncConnector());
  return PowerSync;
};

export async function insertCustomer(customer: { name: string, location: string }) {
  await PowerSync.execute('INSERT INTO customers(id, name, location) VALUES(uuid(), ?, ?)', [customer.name, customer.location]);
}
