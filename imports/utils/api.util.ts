import { fetch, Headers } from "meteor/fetch";

import { catchErrorMsg } from "./message.util";

type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type TMode = 'cors' | 'same-origin' | 'no-cors';
type TCache = 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached';
type TCredentials = 'same-origin' | 'include' | 'omit';
type TRedirect = 'manual' | 'follow' | 'error';
type TReferrerPolicy = 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';

type TFetchOptions = {
  method: TMethod;
  mode: TMode;
  cache: TCache;
  credentials: TCredentials;
  headers: Headers;
  redirect: TRedirect;
  referrerPolicy: TReferrerPolicy;
};

/**
 * Fetches data from the specified URL using a GET request.
 * 
 * @link https://docs.meteor.com/packages/fetch
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 * 
 * The request is configured to use CORS, no-cache, same-origin credentials, and includes
 * JSON content headers. Redirects are followed and the referrer policy is set to no-referrer.
 * If an error occurs, it is handled by catchErrorMsg.
 */
export const getData = (url: string): Promise<Response> => {
  const options: TFetchOptions = {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  }

  try {
    return fetch(url, options);
  } catch (err) {
    catchErrorMsg(err);
  }
}