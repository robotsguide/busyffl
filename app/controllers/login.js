import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      const username = Ember.$('.login-box > input[type="text"]').val();
      const password = Ember.$('.login-box > input[type="password"]').val();
      const model = this.get('model');

      this.get('session').authenticate('authenticator:basic', { username, password, model });
    },
  }
});
