import Environment from "/imports/api/environment/Environment";
import Widget from "/imports/api/environment/Widget";

import { EmptyWidget } from "/imports/api/widgets/empty.widget";
import { EnvironmentsCollection } from "/imports/collections/environments.collection";

import { IUser, TEnvironmentEdit } from "/imports/config/types";
import { t, TIntl } from "/imports/utils/i18n.util";
import { successSaveMsg, catchErrorMsg, successDeleteMsg, catchWarnMsg } from "/imports/utils/message.util";

import { getWidgetBy } from "./widget.service";

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
  const { _id } = getWidgetBy("resource", "empty");

  layout.addWidget({ ...new Widget(EmptyWidget, user), _id });

  Meteor.callAsync("environmentInsert", { ...env }).
    then((_id: string) => {
      successSaveMsg();
      handleRefresh();

      Meteor.callAsync("layoutInsert", { ...layout, environmentId: _id }).catch(catchErrorMsg);
    }).
    catch(catchErrorMsg);
};

/**
 * Deletes an environment by its _id.
 * 
 * This function makes an asynchronous call to remove the specified environment
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion fails,
 * a warning message is shown. Any errors during the process are caught and handled.
 * 
 * @param {string} _id - The unique identifier of the environment to delete.
 * @param {TIntl} intl - The internationalization object for localization.
 * @param {() => void} handleRefresh - Callback function to refresh the environment list after deletion.
 */
export const deleteEnvironment = (_id: string, intl: TIntl, handleRefresh: () => void) => {
  Meteor.callAsync('environmentRemove', { _id }).
    then((res: number) => {
      if (res > 0) {
        successDeleteMsg();
        handleRefresh();
      } else {
        catchWarnMsg({
          errorType: 'warning',
          message: t(intl, 'error.warningMsg'),
          error: 'Error 400'
        });
      }
    }).catch(catchErrorMsg)
};

/**
 * Calls a Meteor method to fetch a list of environments and
 * sets the provided state callback with the response.
 *
 * @param {string} method - The name of the Meteor method to call.
 * @param {(res: any[]) => void} setEntities - The state callback to set the environment list.
 * @param {{}} opts - An object of options to pass to the Meteor method.
 */
export const getEnvironments = (method: string, setEntities: (res: any[]) => void, opts: {}) => {
  Meteor.callAsync(method, opts).then((res: any[]) => {
    setEntities(res);
  }).catch((e) => catchErrorMsg(e, () => setEntities([])));
};

/**
 * Get an environment by its _id
 * 
 * @param {string} _id - The unique identifier of the environment to get.
 * @return {TEnvironmentEdit} - The environment object
 */
export const getEnvironment = (_id: string): TEnvironmentEdit =>
  EnvironmentsCollection.findOne({ _id }) as TEnvironmentEdit;