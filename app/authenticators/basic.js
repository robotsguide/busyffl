
import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({
  store: Ember.inject.service('store'),

  authenticate(args) {
    return this.get('store').findAll('member').then(model => {
      if(Ember.isEmpty(args.username) || Ember.isEmpty(args.password)) {
        return Ember.RSVP.reject("Username or password must be provided");
      }

      const user = args.username;
      const password = btoa(args.password);

      const member = model.findBy('username', user);
      if(Ember.isNone(member) || Ember.isNone(member.get) || Ember.isNone(member.get('id'))) {
        return Ember.RSVP.reject("Data is syncing please wait and try again in a moment!");
      }

      if(member.get('password') !== password) {
        return Ember.RSVP.reject("Password is incorrect");
      }

      const data = member.toJSON();
      data.id = member.id;
      return Ember.RSVP.resolve(data);
    });
  },

  restore(data) {
    return Ember.RSVP.resolve(data);
  },
});
