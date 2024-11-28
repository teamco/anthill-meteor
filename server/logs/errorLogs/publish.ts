import { Meteor } from "meteor/meteor";
import { ErrorLogsCollection } from "/imports/collections/errorLogs.collection";

Meteor.publish("errorLogs", () => {
  return ErrorLogsCollection.find();
});