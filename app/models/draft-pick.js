import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  teamId: DS.attr('string'),
  roundNumber: DS.attr('number'),
  pickNumber: DS.attr('number'),
});
