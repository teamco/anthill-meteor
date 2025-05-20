import { Meteor } from 'meteor/meteor';
import { SocialCollection } from '/imports/collections/social.collection';

Meteor.publish('social', () => {
  return SocialCollection.find();
});
