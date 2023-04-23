#!/usr/local/bin/ts-node
import express, { Request, Response, NextFunction } from 'express';
import Params from './interfaces/Params';
import Logger from './api_modules/logger';
import Rater from './api_modules/rater';
import Users from './api_modules/users';
const app = express();
//const hostname = 'localhost';
//const port = 3000;
const hostname = 'api.currency-calculator.space';
const port = 80;

/* 
  Make the static microservice documentation 
  available to be sent to the client.
*/
app.use('/transactions', express.static('apidoc'))

// Set some headers and proceed with the request.
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  next();
}); 

/*
  user_id must be a number.
  Proceed with request execution or returns to the client 
  an error object explaining the failure reason.
*/
app.param('user_id', (req: Request, res: Response, next: NextFunction) => {
  if (!isNaN(+req.params.user_id)) {
    next();
  } else {
    res.json(Logger.getMessage(401)); 
  }
});

/*
  conversion_id must be a number.
  Proceed with request execution or returns to the client 
  an error object explaining the failure reason.
*/
app.param('conversion_id', (req: Request, res: Response, next: NextFunction) => {
  if (!isNaN(+req.params.conversion_id)) {
    next();
  } else {
    res.json(Logger.getMessage(409)); 
  }
});

// Returns to the client an error object explaining the failure reason.
app.get('/', (req: Request, res: Response) => {
  res.json(Logger.getMessage(400));
});

// Returns to the client the microservice documentation. 
app.get('/transactions', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname + '/apidoc/index.html')
});

/*
  Returns to the client an currencies object listing 
  all the currencies available for conversion. 
*/
app.get('/transactions/currencies', (req: Request, res: Response) => {
  res.json( Rater.getCurrencyNames() );
});

/*
  Returns to the client an users object 
  or an error object explaining the failure reason. 
*/
app.get('/transactions/users', async (req: Request, res: Response) => {
  const users = await Users.getUsers();
  if ( users ) {
    res.json( users );
  } else {
    res.json(Logger.getMessage(504));
  }
});

/*
  Returns to the client an user object associated to the id 
  or an error object explaining the failure reason. 
*/
app.get('/transactions/users/:user_id', async (req: Request, res: Response) => {
  const id = +req.params.user_id;
  const user = await Users.getUser(id);
  if ( user ) {
    res.json(user);
  } else {
    res.json(Logger.getMessage(402));
  }
});

/*
  Returns to the client the following: 
  1) All the recent conversions made by the specified user_id 
     if no query parameters are sent. 
  2) An error object explaining the failure reason   
     for query parameters checking 
  3) The accomplished object conversion made.
  4) An error object explaining the failure for any other reason.
*/
app.get('/transactions/users/:user_id/conversions', async (req: Request, res: Response) => { 
  const user_id = +req.params.user_id;
  const user = await Users.getUser(user_id);
  if ( user ) {
    if (Object.keys(req.query).length) {
      const params: Params = {
        from: typeof req.query.from === 'string' ? req.query.from : '', 
        to: typeof req.query.to === 'string' ? req.query.to : '',
        amount: typeof req.query.amount === 'string' ? req.query.amount : ''
      };
      const result = Rater.checkQueryParams(params);
      if ( result ) {
        res.json(result); //2
      } else {
        const response = await Rater.doConversion( params, user_id );
        if ( response ) {
          const status_saved = await Rater.saveConversion( response );
          if ( status_saved ) {
            res.json(response[+Object.keys(response)[0]]);//3
          } else {
            res.json(Logger.getMessage(502)); //4
          }
        } else {
          res.json(Logger.getMessage(501)); //4
        }
      }
    } else {
      const conversions = await Users.getUserConversions( +req.params.user_id ); //1
      res.json(conversions);
    }
  } else {
    res.json(Logger.getMessage(402)); //4
  }
});

/*
  Returns to the client an conversion object associated to the id 
  or an error object explaining the failure reason. 
*/
app.get('/transactions/users/:user_id/conversions/:conversion_id', async (req: Request, res: Response) => {
  const user_id = +req.params.user_id;
  const user = await Users.getUser(user_id);
  if ( user ) {
    const conversion_id = +req.params.conversion_id;
    const conversion = await Users.getConversion( conversion_id, user_id );
    if ( conversion.length ) {
      res.json(conversion);
    } else {
      res.json(Logger.getMessage(410));
    }
  } else {
    res.json(Logger.getMessage(402));
  }
});

 /* 
    Catch any endpoint that does not exists and returns 
    an error object explaining the failure reason. 
 */
app.all("*", (req: Request, res: Response) => {
  res.json(Logger.getMessage(499)); 
});

// Make server to listen to specified port.
app.listen(port, hostname, function() {
  console.log(`Server running at http://${hostname}:${port}/transactions/`);
  /* 
    Run once to create de database environment. 
    Must uncomment line in DB.configure().
  */
  //DB.configure() 
});
