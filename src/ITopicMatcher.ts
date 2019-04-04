export interface ITopicMatcher {
  matchesMqtt(topic: string, filter: string): boolean;
}
