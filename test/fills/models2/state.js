import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  battle: belongsTo('battle', {async: true}),
  name: attr('string'),
  petStates: hasMany('petState', {async: true}),
  currentTurn: attr('integer')
});
