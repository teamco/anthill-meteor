import { catchErrorMsg } from '/imports/utils/message.util';

/**
 * Calls a Meteor method to fetch a list of environments and
 * sets the provided state callback with the response.
 *
 * @param {string} method - The name of the Meteor method to call.
 * @param {(res: any[]) => void} setEntities - The state callback to set the environment list.
 * @param {{}} opts - An object of options to pass to the Meteor method.
 */
export const getEntities = (
  method: string,
  setEntities: (res: any[]) => void,
  opts: {},
) => {
  Meteor.callAsync(method, opts)
    .then((res: any[]) => {
      setEntities(res);
    })
    .catch((e) => catchErrorMsg(e, () => setEntities([])));
};
