import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import currencies from 'red-green-client/constants/currencies';
import Ember from 'ember';

export default Model.extend({
  currency: attr('string'),
  email: attr('string'),
  uid: attr('string'),
  nickname: attr('string'),
  image: attr('string'),
  currencySymbol: Ember.computed('currency', function() {
    return currencies[this.get('currency')].symbol;
  }),
  pets: hasMany('pet', {async: true}),
  battles: hasMany('battle', {async: true}),
  online: attr('boolean'),
  gameStats: hasMany('gameStat', {async: true}),
  avatar: attr('string')
});
