import Environment from "/imports/api/environment/Environment";
import { EmptyWidget } from "/imports/api/widgets/empty.widget";

import { IUser } from "/imports/config/types";

import { successSaveMsg, catchErrorMsg } from "/imports/utils/message.util";

/**
 * Creates a new environment with a single empty widget.
 *
 * @param {string} name - The name of the environment
 * @param {string} type - The type of the environment
 * @param {IUser} user - The user creating the environment
 * @param {() => void} handleRefresh - Function to call after the environment is created
 * @param {Object} [optional] - An object containing optional description
 * @param {string} [optional.description] - The description of the environment
 */
export const createEnvironment = (name: string, type: string, user: IUser, handleRefresh: () => void, optional: { description?: string }) => {
  const env = new Environment(name, type, user, {
    description: optional.description
  });
  const layout = env.createLayout(user);

  layout.addWidget(new EmptyWidget(null, user));

  Meteor.callAsync("environmentsInsert", { ...env }).
    then((_id: string) => {
      successSaveMsg();
      handleRefresh();
    }).
    catch(catchErrorMsg);
};