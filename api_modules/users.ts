
import DB from './database';
import Conversions from '../interfaces/Conversions';
import Conversion from '../interfaces/Conversion';

/*
  In the future a class Users maybe 
  created to manage all users informations 
  and data.
*/

class Users {

  public async getUser( id: number ) { 
    const userCollection = DB.getCollection( 'users' );
    return await userCollection.get(id) || false;
  }

  public async getUsers() {
    const users: Users[] = [];
    const userCollection = DB.getCollection( 'users' );
    const keys = await userCollection.getKeys();
    for (const i of keys) { users.push( await userCollection.get(i) ); }
    return users;
  }

  public async getUserConversions( id: number ) {
    const conversions: Conversions[] = [];
    const transactionsCollection = DB.getCollection( 'transactions' );
    const keys = await transactionsCollection.getKeys({ limit: 1000, reverse: true });
    for (const i of keys) { 
      const item = await transactionsCollection.get(i);
      if ( +item.user_id == id ) { conversions.push( item ); }
    }
    return conversions;
  }

  public async getConversion( conversion_id: number, user_id: number ) {
    const conversion: Conversion[] = [];
    const transactionsCollection = DB.getCollection( 'transactions' );
    const item = await transactionsCollection.get( conversion_id + '' );
    if ( item ) {
      if ( item.user_id == user_id + '' ) { conversion.push( item ); }
    }
    return conversion;
  }

}

export default new Users;
