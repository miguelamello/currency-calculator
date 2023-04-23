
import axios from 'axios';
import env from './env-config';
import Users from '../interfaces/Users';

describe('GET /transactions/users', () => {

  const endpoint = `${env.protocol}://${env.host}:${env.port}/transactions/users`;

  it(
    `
      *** Integration Testing ***

      This endpoint must returns an array of 
      user objects representing the all the 
      users registered on the server or 
      an empty array if no users are 
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
        response.data.forEach( ( user: Users ) => {

          //If users object returns. It must have those properties.
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('email');

          //All values must be not empty or null.
          expect(typeof user.id === 'string').toBeTruthy();
          expect(typeof user.name === 'string').toBeTruthy();
          expect(typeof user.email === 'string').toBeTruthy();

        });
      }
    }

  );
});


