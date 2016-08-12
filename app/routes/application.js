import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';


export default Ember.Route.extend(ApplicationRouteMixin, {

  model() {
    return this.store.findAll('member').then(models => {
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

    waivers() {
      this.transitionTo('waivers');
    },

    players() {
      this.transitionTo('players');
    },

    trades() {
      this.transitionTo('trades');
    },

    settings() {
      this.transitionTo('settings');
    },

    logout() {
      this.get('session').invalidate('authenticator:basic');
    }
  }
});
