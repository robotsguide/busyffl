import DS from 'ember-data';
import { Model } from 'ember-pouch';

export default Model.extend({
  fromTeamId: DS.attr('string'),
  toTeamId: DS.attr('string'),

  fromPlayer: DS.attr('string'),
  toPlayer: DS.attr('string'),

  fromPick: DS.attr('string'),
  toPick: DS.attr('string'),

  submittedOn: DS.attr('number'),
  acceptedOn: DS.attr('number'),
  rejectedOn: DS.attr('number'),

  fromTeam: null,
  toTeam: null,
  fromPlayerModels: null,
  toPlayerModels: null,
  fromPickModels: null,
  toPickModels: null
});
