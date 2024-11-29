import { Meteor } from "meteor/meteor";
import { UserLogsCollection } from "/imports/collections/userLogs.collection";

Meteor.publish("userLogs", () => {
  return UserLogsCollection.find();
});