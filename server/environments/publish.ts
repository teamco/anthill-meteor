import { Meteor } from 'meteor/meteor';
import { EnvironmentsCollection } from '/imports/collections/environments.collection';

Meteor.publish('environments', () => {
  return EnvironmentsCollection.find();
});
