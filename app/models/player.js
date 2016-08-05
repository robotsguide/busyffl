import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  rosterId: DS.attr('string'),
  name: DS.attr('string'),
  postition: DS.attr('string'),
  team: DS.attr('string'),
  cost: DS.attr('number'),
  type: DS.attr('number'),

  priceTag: Ember.computed('cost', function() {
    let price = '';
    if (!Ember.isNone(this.get('cost'))) {
      price = '$' + this.get('cost');
    }
    return price;
  })
});
