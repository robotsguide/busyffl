import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  init() {
    this._super();

    this.dbSync();
    Ember.addObserver(window, 'isSync', this, 'dbSync');
  },

  dbSync() {
    this.set('isSync', Ember.get(window, 'isSync'));
  },
});
