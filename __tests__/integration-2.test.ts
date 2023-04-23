
import axios from 'axios';
import env from './env-config';

describe('GET /transactions/users/1/conversions/10000', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users/1/conversions/10000`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an error message 
      since the sent conversion ID does not exists 
      on the server.

      *** 
        Please verify if the test environment variables in "env-config.ts" 
        matches your setup and also if server is running in background. 
      ***
    `, 
    async () => {
      
      const response = await axios.get(endpoint);
      expect(response.status).toBe(200);

      //Error message object must contains those properties
      expect(response.data).toHaveProperty('status');
      expect(response.data).toHaveProperty('message');

      //Must be those types.
      expect(typeof response.data['status'] === 'number').toBeTruthy();
      expect(typeof response.data['message'] === 'string').toBeTruthy();

      //Must be those values.
      expect(response.data['status']).toBe(410);
      expect(response.data['message']).toBe('Conversion ID does not exist.');

    }
  );
  
});


