import Ember from 'ember';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),

  errorMessage: '',
  showErrorMessage: false,

  showError(err) {
    this.set('errorMessage', err);
    this.set('showErrorMessage', true);
  },

  actions: {
    authenticate() {
      this.set('showErrorMessage', false);
      this.set('errorMessage', '');

      const username = Ember.$('.login-box > input[type="text"]').val();
      const password = Ember.$('.login-box > input[type="password"]').val();

      this.get('session').authenticate('authenticator:basic', { username, password }).catch(err => this.showError(err));
    },
  }
});
