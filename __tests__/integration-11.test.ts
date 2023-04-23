
import axios from 'axios';
import env from './env-config';
import Currencies from '../interfaces/Currencies';

describe('GET /transactions/currencies', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/currencies`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns a collection of available currency code objects for use in a conversion.

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
        response.data.forEach( ( item: Currencies ) => {

          expect(typeof Object.keys(item)[0] === 'string').toBeTruthy();
          expect(typeof Object.values(item)[0] === 'string').toBeTruthy();

        });
      }

    }
  );
  
});


