import {HTTP} from 'meteor/http';

export const googleProfile = (user, info) => {
  const accessToken = user.services.google.accessToken;
  const result = HTTP.call('GET', 'https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {'User-Agent': 'Meteor/3.0'},
    params: {access_token: accessToken}
  });

  // if (result.error) {
  //   return throwError(result.error);
  // }

  return {
    name: info.name,
    email: info.email,
    link: result.data.profile,
    locale: info.locale,
    picture: info.picture
  };
};