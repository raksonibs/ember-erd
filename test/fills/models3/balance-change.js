import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Ember from 'ember';

export default Model.extend({
  changeType: attr('string'),
  entryDate: attr('string'),
  value: attr('number'),
  isExpense: Ember.computed('changeType', function() {
    return this.get('changeType') === 'expense';
  }),
  isIncome: Ember.computed.not('isExpense'),
  user: belongsTo('user')
});
