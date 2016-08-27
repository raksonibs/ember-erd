import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  users: hasMany('user'),
  winnerId: attr('number'),
  loserId: attr('number'),
  winnerEmail: attr('string'),
  loserEmail: attr('string'),
  name: attr('string'),
  challengedEmail: attr('string'),
  challengerEmail: attr('string'),
  status: attr('string'),
  challengerPetId: attr('string'),
  challengedPetId: attr('string'),
  challengerPet: attr(),
  challengedPet: attr(),
  pets: hasMany('pet', {async: true}),  
  currentTurn: attr('number'),
  state: belongsTo('state', {async: true}),
  currentTurnEmail: attr('string'),
  createdAt: attr('string'),
});
