import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('teams', function() {
    this.route('team', {path: 'teams/:id'});
  });
  this.route('players');
  this.route('waivers');
  this.route('login');
  this.route('settings');
});

export default Router;
