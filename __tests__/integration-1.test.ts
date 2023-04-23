
import axios from 'axios';
import env from './env-config';

describe('GET /transactions/', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an html containing the complete 
      microservice documentation.
      
      *** 
        Please verify if the test environment variables in "env-config.ts" 
        matches your setup and also if server is running in background. 
      ***
    `, 
    async () => {
      const response = await axios.get(endpoint);
      expect(response.status).toBe(200);
      expect((response.data).includes('CURRENCY CONVERSION CALCULATOR MICROSERVICE DOCUMENTATION')).toBeTruthy();
    }
  );
  
});
