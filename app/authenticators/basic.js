
import Ember from 'ember';
import BaseAuthenticator from 'ember-simple-auth/authenticators/base';

export default BaseAuthenticator.extend({

  authenticate(args) {
    if(Ember.isEmpty(args.username) || Ember.isEmpty(args.password) || Ember.isEmpty(args.model)) {
      return Ember.RSVP.reject("Username or password must be provided");
    }

    const user = args.username;
    const password = btoa(args.password);
    const model = args.model;

    const member = model.findBy('username', user);
    if(Ember.isNone(member)) {
      Ember.RSVP.reject("Username does not match any users in the system.");
    }

    if(member.get('password') !== password) {
      Ember.RSVP.reject("Password is incorrect");
    }

    const data = member.toJSON();
    data.id = member.id;
    return Ember.RSVP.resolve(data);
  },

  restore(data) {
    return Ember.RSVP.resolve(data);
  },
});
