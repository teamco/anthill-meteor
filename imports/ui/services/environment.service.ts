import Environment from "/imports/api/environment/Environment";
import { EmptyWidget } from "/imports/api/widgets/empty.widget";

import { IUser } from "/imports/config/types";

import { successSaveMsg, catchMsg } from "/imports/utils/message.util";

/**
 * Creates a new environment with an empty layout and an empty widget, and inserts
 * it into the EnvironmentsCollection.
 *
 * @param {string} name - The name of the environment
 * @param {string} type - The type of the environment
 * @param {IUser} user - The user creating the environment
 * @param {() => void} handleRefresh - A function to call when the insertion is complete
 */
export const createEnvironment = (name: string, type: string, user: IUser, handleRefresh: () => void) => {
  const env = new Environment(name, type, user);
  const layout = env.createLayout(user);

  layout.addWidget(new EmptyWidget(null, user));

  Meteor.callAsync("environmentsInsert", { ...env }).
    then((_id: string) => {
      successSaveMsg();
      handleRefresh();
    }).
    catch(catchMsg);
};