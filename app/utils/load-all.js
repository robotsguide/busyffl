import Ember from 'ember';

export default function loadAll(store) {
  return Ember.RSVP.hash({
    members: store.findAll('member'),
    teams: store.findAll('team'),
    draftPicks: store.findAll('draft-pick'),
    teamRosters: store.findAll('team-roster'),
    players: store.findAll('player')
  });
}
