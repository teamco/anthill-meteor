import { Meteor } from "meteor/meteor";
import { Mongo } from 'meteor/mongo';

export const EnvironmentsCollection = new Mongo.Collection('environments');
