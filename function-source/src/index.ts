import { CloudEvent, cloudEvent } from '@google-cloud/functions-framework';
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData';
import { StiggConnector} from './StiggConnector';
import { EventParser } from './EventParser';

const stiggConnector = new StiggConnector();
const eventParser = new EventParser();

cloudEvent('EventForwarder', (cloudEvent: CloudEvent<MessagePublishedData>) => {
  try {

    // parse the message
    const message = JSON.parse(Buffer.from(cloudEvent.data.message.data, 'base64').toString());

    // extract the event data
    const customerId = eventParser.getCustomerId(message);
    const idempotencyKey = eventParser.getIdempotencyKey(message);
    const eventName = eventParser.getEventName(message);
    const dimensions = eventParser.getDimensions(message);

    // add the event to the buffer
    stiggConnector.addEvent({
      customerId,
      idempotencyKey,
      eventName,
      dimensions,
    });
  } catch (err) {
    console.warn('skipping - failed to parse message', err);
  }
});