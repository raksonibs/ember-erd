# Ember-ERD

A project to visualize your model directory, and give a good indication of how well your database, serializers, and ember-data are playing together.

Install via `npm install ember-erd`.

By running `node node_modules/ember-erd/bin/index.js`, you generate an index.html you can view.

![screenshot](https://raw.githubusercontent.com/raksonibs/ember-erd/master/erd.png)

* double arrow means hasMany both Ways
* hasOne is a straight line inbetween
* hasMany is from parent to child where child has arrow

## Note
Currently works best on model files with the standard format below. Anything else currently creates undesired mappings.
```
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
```

## Testing

* Run `npm test` in forked repo!