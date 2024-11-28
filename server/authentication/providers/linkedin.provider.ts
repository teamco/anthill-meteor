import _ from 'lodash';
import { HTTP } from 'meteor/http';

/**
 * @method linkedinProfile
 * @param user
 * @param info
 * @returns {{name, email, link, locale: *, picture: *}}
 */
export const linkedinProfile = (user, info) => {

  const accessToken = user.services.linkedin.accessToken;

  // http://developer.linkedin.com/documents/profile-fields
  const basicProfileFields = [
    'first-name', 'last-name', 'maiden-name', 'formatted-name', 'phonetic-first-name',
    'phonetic-last-name', 'formatted-phonetic-name', 'headline', 'location',
    'industry', 'num-connections', 'num-connections-capped', 'summary', 'current-share',
    'specialties', 'positions', 'picture-url', 'picture-urls::(original)', 'site-standard-profile-request'],
    emailFields = ['email-address'],
    fullProfileFields = [
      'last-modified-timestamp', 'proposal-comments', 'associations', 'interests', 'publications',
      'patents', 'languages', 'skills', 'certifications', 'educations',
      'courses', 'volunteer', 'three-current-positions', 'three-past-positions', 'num-recommenders',
      'recommendations-received', 'following', 'job-bookmarks', 'suggestions', 'date-of-birth'],
    contactInfoFields = [
      'phone-numbers',
      'bound-account-types',
      'im-accounts',
      'main-address',
      'twitter-accounts',
      'primary-twitter-account'];

  const params = _.union(basicProfileFields, emailFields, fullProfileFields, contactInfoFields);
  const requestUrl = 'https://api.linkedin.com/v1/people/~:(' + params.join(',') + ')';

  const response = HTTP.call('GET', requestUrl, {
    headers: { 'User-Agent': 'Meteor/3.0' },
    params: { oauth2_access_token: accessToken, format: 'json' }
  });

  console.log(response);

  // if (response.error) {
    // return throwError(response.error);
  // }

  return {
    name: response.data.formattedName,
    email: response.data.emailAddress,
    link: response.data.siteStandardProfileRequest.url,
    locale: response.data.location.name,
    picture: response.data.pictureUrl,
    industry: response.data.industry,
    numConnections: response.data.numConnections,
    currentPosition: response.data.positions
  };
};