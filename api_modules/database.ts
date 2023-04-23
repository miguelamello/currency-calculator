
import lmdb from 'lmdb';
import Database from '../interfaces/Database';
import DBCollections from '../interfaces/DBCollections';
class DB {

  private db: Database;
  private users: Database;
  private transactions: Database;
  private counters: Database;
  private collections: DBCollections = {};

  constructor() {
    this.db = lmdb.open({ path: 'database' });
    this.users = this.db.openDB('users');
    this.transactions = this.db.openDB('transactions');
    this.counters = this.db.openDB('counters');
    this.mapCollections();
  }

  private mapCollections() {
    this.collections = {
      users: this.users,
      transactions: this.transactions,
      counters: this.counters
    };
  }

  public getCollection( name: string ): Database {
    if ( this.collections[ name ]) {
      return this.collections[ name ] as Database;
    } else {
      throw new Error(`Collection with name ${name} not found`);
    }
  }

  /*
    This must be executed only once for database initical setup.
  */
  public configure() {
    this.db.transactionSync(() => {
      //this.counters.put(1, 0);
      //this.transactions.put(1, {});
      //this.users.put(1, { id: '1', name: 'Miguel Angelo Mello', email: 'miguelangelomello@gmail.com' });
      //this.users.put(2, { id: '2', name: 'Ana Maria Braga', email: 'anamariabraga@outlook.com' });
      //this.users.put(3, { id: '3', name: 'Frank Sinatra', email: 'franksinatra@gmail.com' });
      //this.users.put(4, { id: '4', name: 'Edson Arantes', email: 'edsonarantes@uol.com.br' });
    });
  }

  public async getTransactionCounter() {
    const oldc = await this.counters.get(1);
    await this.counters.put(1, oldc + 1);
    return await this.counters.get(1);
  }

}

export default new DB;
