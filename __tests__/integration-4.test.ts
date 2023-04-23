
import axios from 'axios';
import env from './env-config';
import Conversions from '../interfaces/Conversions';

describe('GET /transactions/users/4/conversions', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users/4/conversions`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an array of 
      conversions objects representing the 
      past conversions made by the client or 
      an empty array if no conversions are 
      found on the server.

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
        response.data.forEach( ( conversion: Conversions ) => {

          //If conversion object returns. It must have those properties.
          expect(conversion).toHaveProperty('transaction_id');
          expect(conversion).toHaveProperty('user_id');
          expect(conversion).toHaveProperty('source_currency');
          expect(conversion).toHaveProperty('source_value');
          expect(conversion).toHaveProperty('target_currency');
          expect(conversion).toHaveProperty('target_value');
          expect(conversion).toHaveProperty('conversion_rate');
          expect(conversion).toHaveProperty('utc_datetime');

          //All values must be not empty or null.
          expect(typeof conversion.transaction_id === 'string').toBeTruthy();
          expect(typeof conversion.user_id === 'string').toBeTruthy();
          expect(typeof conversion.source_currency === 'string').toBeTruthy();
          expect(typeof conversion.source_value === 'string').toBeTruthy();
          expect(typeof conversion.target_currency === 'string').toBeTruthy();
          expect(typeof conversion.target_value === 'string').toBeTruthy();
          expect(typeof conversion.conversion_rate === 'string').toBeTruthy();
          expect(typeof conversion.utc_datetime === 'string').toBeTruthy();

        });
      }
    }

  );
});


