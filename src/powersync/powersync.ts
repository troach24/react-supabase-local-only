import { Column, ColumnType, Schema, Table, PowerSyncDatabase } from '@powersync/web';

/**
 * A placeholder connector which doesn't do anything.
 * This is just used to verify that the sync workers can be loaded
 * when connecting.
 */
class DummyConnector {
  async fetchCredentials() {
    return {
      endpoint: '',
      token: ''
    };
  }

  async uploadData(database) {}
}

export const AppSchema = new Schema([
  new Table({ name: 'customers', columns: [new Column({ name: 'name', type: ColumnType.TEXT })] })
]);

export let PowerSync: PowerSyncDatabase;

const openDatabase = async () => {
  PowerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: { dbFilename: 'test.sqlite' }
  });

  await PowerSync.init();

  // Run local statements.
  await PowerSync.execute('INSERT INTO customers(id, name) VALUES(uuid(), ?)', ['Frank']);

  // const result = await PowerSync.getAll('SELECT * FROM customers');
  // console.log('contents of customers: ', result);

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
  await PowerSync.connect(new DummyConnector());
};

document.addEventListener('DOMContentLoaded', (event) => {
  openDatabase();
});
