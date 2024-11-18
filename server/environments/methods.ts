import { Meteor } from "meteor/meteor";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";

Meteor.methods({
  environmentsInsert: (doc) => {
    return EnvironmentsCollection.insertAsync(doc);
  },
});