import { Meteor } from "meteor/meteor";
import { WidgetsCollection } from "/imports/collections/widgets.collection";

Meteor.publish("widgets", () => {
  return WidgetsCollection.find();
});