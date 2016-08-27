import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
// import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  currentHealth: attr('number'),
  currentAttack: attr('number'),
  currentDefence: attr('number'),
  shield: attr('boolean'),
  state: belongsTo('state', {async: true}),  
  pet: belongsTo('pet', {async: true}),
});
