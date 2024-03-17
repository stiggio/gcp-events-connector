const { default: Stigg} = require('@stigg/node-server-sdk');
const { chunk } = require('lodash');

class StiggConnector {

  stigg = Stigg.initialize({
    apiKey: process.env.STIGG_API_KEY,
    baseUri: process.env.STIGG_BASE_URI,
    realtimeUpdatesEnabled: false,
  });

  buffer = [];
  nextTick;

  addEvent(event) {
    console.log('Adding event to buffer')
    this.buffer.push(event);
    this.setNextTick();
  }

  setNextTick() {
    if (this.nextTick || this.buffer.length === 0) {
      return;
    }

    this.nextTick = setTimeout(this.flush.bind(this), 1000);
  }

  async flush() {
    const events = this.buffer.splice(0);
    if (events.length === 0) {
      return;
    }

    console.log(`Flushing ${events.length} events`);
    for (const aChunk of chunk(events, 1000)) {
      try {
        await this.stigg.reportEvent(events);
      } catch (err) {
        console.warn('Failed to send chunk of events (re-adding them to buffer)', err);
        this.buffer.push(...aChunk);
      }
    }

    this.nextTick = null;
    this.setNextTick();
  }
}

module.exports = StiggConnector;