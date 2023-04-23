
import axios from 'axios';
import env from './env-config';

describe('GET /transactions/users/1', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users/1`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an object contain 
      the information about the user ID. 

      *** 
        Please verify if the test environment variables in "env-config.ts" 
        matches your setup and also if server is running in background. 
      ***
    `, 
    async () => {
      
      const response = await axios.get(endpoint);
      expect(response.status).toBe(200);

      //User object must contains those properties
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('email');

      //Must be those types.
      expect(typeof response.data['id'] === 'string').toBeTruthy();
      expect(typeof response.data['name'] === 'string').toBeTruthy();
      expect(typeof response.data['email'] === 'string').toBeTruthy();

    }
  );
  
});


