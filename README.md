## Ember-ERD

A project to visualize your model directory, and give a good indication of how well your database, serializers, and ember-data are playing together.

Install via `npm install ember-erd`.

By running `node node_modules/ember-erd/bin/index.js`, you generate an index.html you can view.

![screenshot](https://raw.githubusercontent.com/raksonibs/ember-erd/master/erd.png)

* double arrow means hasMany both Ways
* hasOne is a straight line inbetween
* hasMany is from parent to child where child has arrow
