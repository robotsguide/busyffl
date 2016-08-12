import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

const kPositionSymbol = {
  10: "QB",
  20: "RB",
  30: "WR",
  40: "TE",
  50: "K",
  60: "DST",
};

export default Model.extend({
  rosterId: DS.attr('string'),
  name: DS.attr('string'),
  postition: DS.attr('string'),
  position: DS.attr('string'),
  team: DS.attr('string'),
  cost: DS.attr('number'),
  type: DS.attr('number'),
  ranking: DS.attr('number'),

  fixPosition: Ember.on('init', Ember.observer('position', 'postition', function() {
    if(Ember.isNone(this.get('position')) && !Ember.isNone(this.get('postition'))) {
      this.set('position', this.get('postition'));
      this.save();
    }
  })),

  priceTag: Ember.computed('cost', function() {
    let price = '';
    if (!Ember.isNone(this.get('cost'))) {
      price = '$' + this.get('cost');
    }
    return price;
  }),

  positionSymbol: Ember.computed('type', function() {
    return kPositionSymbol[this.get('type')];
  })
});
