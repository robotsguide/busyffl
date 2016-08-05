import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  name: DS.attr('string'),
  ownerId: DS.attr('string'),
  round1: DS.attr('number'),
  round2: DS.attr('number'),
  round3: DS.attr('number'),
  round4: DS.attr('number'),
  round5: DS.attr('number'),
  round6: DS.attr('number'),
  round7: DS.attr('number'),
  round8: DS.attr('number'),
  round9: DS.attr('number'),
  round10: DS.attr('number'),
  round11: DS.attr('number'),
  round12: DS.attr('number'),
  round13: DS.attr('number'),
  round14: DS.attr('number'),

  franchiseName: Ember.computed('name', function() {
    return this.get('name').toUpperCase();
  })
});
