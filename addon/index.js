import FallbackResolver from 'dangerously-set-unified-resolver/fallback-resolver';
import emberConfig from 'dangerously-set-unified-resolver/ember-config';

export default FallbackResolver.extend({
  config: emberConfig
});
