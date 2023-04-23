
import axios from 'axios';
import env from './env-config';

describe('GET /transactions/users/1/conversions?from=BRL&to=USD&amount=100', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users/1/conversions?from=BRL&to=USD&amount=100`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an object literal containing information about the conversion made. 

      *** 
        Please verify if the test environment variables in "env-config.ts" 
        matches your setup and also if server is running in background. 
      ***
    `, 
    async () => {
      
      const response = await axios.get(endpoint);
      expect(response.status).toBe(200);

      //If conversion object returns. It must have those properties.
      expect(response.data).toHaveProperty('transaction_id');
      expect(response.data).toHaveProperty('user_id');
      expect(response.data).toHaveProperty('source_currency');
      expect(response.data).toHaveProperty('source_value');
      expect(response.data).toHaveProperty('target_currency');
      expect(response.data).toHaveProperty('target_value');
      expect(response.data).toHaveProperty('conversion_rate');
      expect(response.data).toHaveProperty('utc_datetime');

      //All values must be not empty or null.
      expect(typeof response.data['transaction_id'] === 'string').toBeTruthy();
      expect(typeof response.data['user_id'] === 'string').toBeTruthy();
      expect(typeof response.data['source_currency'] === 'string').toBeTruthy();
      expect(typeof response.data['source_value'] === 'string').toBeTruthy();
      expect(typeof response.data['target_currency'] === 'string').toBeTruthy();
      expect(typeof response.data['target_value'] === 'string').toBeTruthy();
      expect(typeof response.data['conversion_rate'] === 'string').toBeTruthy();
      expect(typeof response.data['utc_datetime'] === 'string').toBeTruthy();

    }
  );
  
});


