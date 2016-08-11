import Ember from 'ember';
import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  name: DS.attr('string'),
  ownerId: DS.attr('string'),

  draftPicks: null,
  teamRosters: null,

  totalActiveSalary: Ember.computed('teamRosters.@each.effectiveCost', function() {
    let total = 0;
    if(!Ember.isEmpty(this.get('teamRosters'))) {
      this.get('teamRosters').forEach(item => {
        total += item.get('effectiveCost');
      });
    }
    return total;
  }),

  totalSalary: Ember.computed('teamRosters.@each.actualCost', function() {
    let total = 0;
    if(!Ember.isEmpty(this.get('teamRosters'))) {
      this.get('teamRosters').forEach(item => {
        total += item.get('actualCost');
      });
    }
    return total;
  }),

  franchiseName: Ember.computed('name', function() {
    return this.get('name').toUpperCase();
  })
});
