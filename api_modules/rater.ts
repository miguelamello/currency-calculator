import axios from 'axios';
import DB from './database';
import Logger from './logger';
import Conversion from '../interfaces/Conversion';
import Params from '../interfaces/Params';
import BaseRate from '../interfaces/BaseRate';
import CalcRate from '../interfaces/CalcRate';
import empty_baserate from './empty-baserate';
import currency_codes from './currency-codes';
import currency_names from './currency-names';
import sample_data from './sample';
class Rater {

  private base_rates: BaseRate;
  private calc_rates: CalcRate;
  private currency_codes: string[] = currency_codes;
  private currency_names: object[] = currency_names;
  private required_keys: string[] = [];
  private baseRatesMonitor: NodeJS.Timeout | null = null;

  constructor() {
    this.base_rates = empty_baserate;
    this.calc_rates = {};
    this.setRequiredKeys();
    this.updateRemoteBaseRates();
    this.getRemoteBaseRates().then((data) => {
      this.setBaseRates( data );
      this.setCalcRates();
    });
  }

  private setBaseRates( rates: BaseRate ) {
    this.base_rates = rates;
  }

  private getBaseRates() {
    return this.base_rates;
  }

  private setRequiredKeys() {
    this.required_keys = [
      'transaction_id','user_id','source_currency','source_value',
      'target_currency','target_value','conversion_rate','utc_datetime'
    ];
  }

  private getRequiredKeys() {
    return this.required_keys;
  }
  
  /*
    Update the currency quotes which 6 hours. 
    Enough for testing purposes.
  */
  private updateRemoteBaseRates() {
    this.baseRatesMonitor = setInterval(() => {
      this.getRemoteBaseRates().then((data) => {
        this.setBaseRates( data );
        this.setCalcRates();
      });
    }, 21600000);
  }

  /*
    Update the currency quotes from remote 
    service to local service. 
  */
  private async getRemoteBaseRates(): Promise<BaseRate> {
    const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=4536573379ad51f7d974045f7bc98ecb&base=EUR&symbols=${currency_codes}`);
    return await response.data;
  }

  /*
    Promisse for mocking a remote service object.
  */
  /*private async getRemoteBaseRates(): Promise<BaseRate> {
    return await Promise.resolve( sample_data );
  }*/

  private getCalcRates() {
    return this.calc_rates;
  }

  /*
    Sets the calculated rates for each currency 
    based on the EURO to determine the 
    rates of the others curencies. 
  */
  private setCalcRates() {
    const base_rates = this.getBaseRates();
    if ( base_rates.success ) {
      for (const [key1, value1] of Object.entries(base_rates.rates)) {
        this.calc_rates[key1] = {};
        this.calc_rates[key1][key1] = 1.00;
        for (const [key2, value2] of Object.entries(base_rates.rates)) {
          if ( key1 === 'EUR') {
            this.calc_rates[key1][key2] = +(value2).toFixed(2) || 0; 
          } else {
            if ( key2 == 'EUR') {
              this.calc_rates[key1][key2] = +(1 / value1).toFixed(2) || 0; 
            } else {
              this.calc_rates[key1][key2] = +((1 / value1) * value2).toFixed(2) || 0;
            }
          }
        }
      }
    }
  }

  private checkConvertedObj( converted_obj: Conversion): boolean { 
    const key_id = +Object.keys(converted_obj)[0];
    if ( isNaN(key_id) ) return false;
    const requiredKeys = this.getRequiredKeys();
    return requiredKeys.every(
      (key_name: string) => converted_obj[key_id].hasOwnProperty.call(converted_obj[key_id], key_name)
    );
  }

  public async saveConversion( response: Conversion ) {
    const transactionsCollection = DB.getCollection( 'transactions' );
    return await transactionsCollection.put(Object.keys(response)[0], response[+Object.keys(response)[0]]);
  }

  /*
    Query parameters sanitization.
  */
  public checkQueryParams( params: Params ) {
    if ( !params.from ) return Logger.getMessage(403);
    if ( !currency_codes.some(item => params.from.includes(item)) ) return Logger.getMessage(406);
    if ( !params.to ) return Logger.getMessage(404);
    if ( !currency_codes.some(item => params.to.includes(item)) ) return Logger.getMessage(407);
    if ( !params.amount ) return Logger.getMessage(405);
    if ( isNaN(+params.amount) ) return Logger.getMessage(408);
    return false;
  }

  /*
    Begin the conversion process. 
    Return an object containg the data for saving in the database.
  */
  public async doConversion( params: Params, user_id: number ) {
    const calc_rates: CalcRate = this.getCalcRates(); 
    const transac_id = await DB.getTransactionCounter();
    const converted_obj: Conversion = { 
      [transac_id]: {
        transaction_id: transac_id + '',
        user_id: user_id + '', 
        source_currency: params.from + '', 
        source_value: (+params.amount).toFixed(2) + '', 
        target_currency: params.to + '', 
        target_value: (+calc_rates[params.from][params.to] * +params.amount).toFixed(2) + '', 
        conversion_rate: calc_rates[params.from][params.to] + '', 
        utc_datetime: new Date().toUTCString()
      }
    };
    return (this.checkConvertedObj(converted_obj)) ? converted_obj : false;
  }

  public getCurrencyCodes() {
    return this.currency_codes;
  }

  public getCurrencyNames() {
    return this.currency_names;
  }

  public stopBaseRatesMonitor() {
    if (this.baseRatesMonitor) {
      clearInterval(this.baseRatesMonitor);
      this.baseRatesMonitor = null;
    }
  }

}

export default new Rater;
