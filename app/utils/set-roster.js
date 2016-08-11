import Ember from 'ember';

export default function setRoster(rosters, players) {
  Ember.assert('roster is not defined', !Ember.isNone(rosters));
  Ember.assert('players is not defined', !Ember.isNone(players));

  rosters.forEach(roster => {
    const player = players.findBy('id', roster.get('playerId'));
    roster.set('player', player);
  });
}
