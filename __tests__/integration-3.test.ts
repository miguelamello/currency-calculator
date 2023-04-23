
import axios from 'axios';
import env from './env-config';

describe('GET /transactions/users/1/conversions/33', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users/1/conversions/33`;

  it(
    `
      *** Integration Testing ***

      This endpoint must return an empty array or 
      and array filled with one conversion object 
      representing the corresponding ID. 

      *** 
        Please verify if the test environment variables in "env-config.ts" 
        matches your setup and also if server is running in background. 
      ***
    `, 
    async () => {
      const response = await axios.get(endpoint);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      if (response.data.length > 0) {
        //If conversion object returns. It must have those properties.
        expect(response.data[0]).toHaveProperty('transaction_id');
        expect(response.data[0]).toHaveProperty('user_id');
        expect(response.data[0]).toHaveProperty('source_currency');
        expect(response.data[0]).toHaveProperty('source_value');
        expect(response.data[0]).toHaveProperty('target_currency');
        expect(response.data[0]).toHaveProperty('target_value');
        expect(response.data[0]).toHaveProperty('conversion_rate');
        expect(response.data[0]).toHaveProperty('utc_datetime');

        //All values must be not empty or null.
        expect(typeof response.data[0]['transaction_id'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['user_id'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['source_currency'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['source_value'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['target_currency'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['target_value'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['conversion_rate'] === 'string').toBeTruthy();
        expect(typeof response.data[0]['utc_datetime'] === 'string').toBeTruthy();
      }
    }
  );
});


