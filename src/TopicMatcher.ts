import { ITopicMatcher } from './ITopicMatcher';

export class TopicMatcher implements ITopicMatcher {
  readonly topicSeparator: string;

  constructor(topicSeparator: string) {
    this.topicSeparator = topicSeparator;
  }

  matchesMqtt(topic: string, filter: string): boolean {
    if (topic === filter) {
      return true;
    } else if (filter === '#') {
      return true;
    } else if (filter === '+' || filter === '') {
      throw new Error(`Invalid filter: ${filter}`);
    }

    // Topic:  topic/dotup-pi001/status
    // Filter: topic/+/status
    const t = topic.split(this.topicSeparator);
    const f = filter.split(this.topicSeparator);

    for (let i = 0; i < t.length; i += 1) {
      const currentTopic = t[i];
      const currentFilter = f.length > i ? f[i] : '';

      if (currentFilter === '#') {
        return true;
      } else if (currentFilter === '+' && (t.length !== (i + 1))) {
        continue;
        continue;
      } else if (currentTopic !== currentFilter) {
        return false;
      }
    }

    return true;
  }

}
