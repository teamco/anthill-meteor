import { Mongo } from 'meteor/mongo';

export const ErrorLogsCollection = new Mongo.Collection('errorLogs');
