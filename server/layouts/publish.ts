import { Meteor } from "meteor/meteor";
import { LayoutsCollection } from "/imports/collections/layouts.collection";

Meteor.publish("layouts", () => {
  return LayoutsCollection.find();
});