import { EventDimensionValue } from '@stigg/node-server-sdk/dist/models';
import { isString } from 'lodash';


/**
 * Parses incoming events and extracts relevant information from them.
 * Change the implementation of the methods to map from your own event structure.
 */
export class EventParser {

  getCustomerId(message: object): string {
    const customerId = message['customerId'];
    if (!isString(customerId)) {
      throw new Error(`Couldn't extract customerId from message`);
    }
    return customerId;
  }

  getIdempotencyKey(message: unknown): string {
    const idempotencyKey = message['idempotencyKey'];
    if (!isString(idempotencyKey)) {
      throw new Error(`Couldn't extract idempotencyKey from message`);
    }
    return idempotencyKey;
  }

  getEventName(message: unknown): string {
    const eventName = message['eventName'];
    if (!isString(eventName)) {
      throw new Error(`Couldn't extract eventName from message`);
    }
    return eventName;
  }

  getDimensions(message: unknown): Record<string, EventDimensionValue> {
    return {};
  }

}