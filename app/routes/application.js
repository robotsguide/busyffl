import Ember from 'ember';

export default Ember.Route.extend({

  init() {
    this._super();
  },

  model() {
    return this.store.findAll('member').then(models => {
      models.forEach(item => {
        console.log(item.get('id'), item.get('firstName'), item.get('lastName'), item.get('username'));
      });
      return models;
    });
  },

  actions: {
    home() {
      this.transitionTo('index');
    },

    teams() {
      this.transitionTo('teams');
    },

    players() {
      this.transitionTo('players');
    },

    settings() {
      this.transitionTo('settings');
    },
  }
});
