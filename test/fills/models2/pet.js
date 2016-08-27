import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  name: attr('string'),
  level: attr('number'),
  vertices: attr('number'),
  user: belongsTo('user', {async: true}),
  colour: attr('string'),
  stats: hasMany('stat', {async: true}),
  battles: hasMany('battle', {async: true}),
  petStates: hasMany('petState', {async: true}),
});
