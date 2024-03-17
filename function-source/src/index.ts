import { CloudEvent, cloudEvent } from '@google-cloud/functions-framework';
import { MessagePublishedData } from '@google/events/cloud/pubsub/v1/MessagePublishedData';
import { StiggConnector} from './StiggConnector';

const stiggConnector = new StiggConnector();

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
cloudEvent('EventForwarder', (cloudEvent: CloudEvent<MessagePublishedData>) => {
  // The Pub/Sub message is passed as the CloudEvent's data payload.
  const base64data = cloudEvent.data.message.data;

  if (!base64data) {
    console.warn('No data in message');
    return;
  }

  try {
    const event = JSON.parse(Buffer.from(base64data, 'base64').toString());
    stiggConnector.addEvent(event);
  } catch (err) {
    console.warn('Error parsing message:', err);
  }
});