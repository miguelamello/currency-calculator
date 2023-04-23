//import DB from './database';
import Messages from '../interfaces/Messages';

class Logger {

  private messages: Messages = {};

  constructor() {

    /*
      Use the process.on() method to register the handleError 
      function as a listener for the uncaughtException event 
      for anything else.
    */
    process.on('uncaughtException', this.handleError);

    /*
      Use the process.on() method to register the handleError 
      function as a listener for the unhandledRejection event 
      for rejected promises.
    */
    process.on('unhandledRejection', this.handleError);

    /*
      Populate this.messages with useful 
      information to the user and system.
    */
    this.setMessages();

  }

  private setMessages() {
    this.messages = {
      400: { status: 400, message: 'Resource not available.' }, 
      401: { status: 401, message: 'User ID must be a number.' },
      402: { status: 402, message: 'User does not exists.' },
      403: { status: 403, message: 'Parameter {from} is required.' },
      404: { status: 404, message: 'Parameter {to} is required.' },
      405: { status: 405, message: 'Parameter {amount} is required.' },
      406: { status: 406, message: 'Parameter {from} must contain one valid currency name abreviation {EUR, BRL, USD, ...}.' },     
      407: { status: 407, message: 'Parameter {to} must contain one valid currency name abreviation {EUR, BRL, USD, ...}.' },
      408: { status: 408, message: 'Parameter {amount} must be a number.' }, 
      409: { status: 409, message: 'Conversion ID must be a number.' },
      410: { status: 410, message: 'Conversion ID does not exist.' },
      499: { status: 499, message: 'Resource does not exist.' },
      501: { status: 501, message: 'Impossible to proceed with conversion. Aborted. Report generated.' },
      502: { status: 502, message: 'Impossible to save conversion. Aborted. Report generated.' },
      503: { status: 503, message: 'Impossible to list conversions. Aborted. Report generated.' },
      504: { status: 504, message: 'Impossible to list users. Aborted. Report generated.' }
    };
  }

  /*
    Receives errors catched by the developer 
    from the application logic.
  */
  public report( error: Error ) {
    /*
      Send Error to email?
      Send Error to file?
      Send Error to database?
      Send Error to real-time monitoring system?
      Display error message to the user?
    */
    console.log( error );
  }

  /*
    Receives errors catch by subsystem 
    in an automatic way.
  */
  public handleError( error: Error ) {
    /*
      Send Error to email?
      Send Error to file?
      Send Error to database?
      Send Error to real-time monitoring system?
      Display error message to the user?
    */
    if (error instanceof Error) {
      console.log( error );
    } else {
      console.log('Unexpected Error');
    }
  }

  /*
    Return a specific message depending from 
    the HTTP status number.
  */
  public getMessage( status: number ) {
    return this.messages[status];
  }

}

export default new Logger;
