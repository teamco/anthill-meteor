import { IUser } from "/imports/config/types";
import { t, TIntl } from "/imports/utils/i18n.util";

import { successSaveMsg, catchErrorMsg, successDeleteMsg, catchWarnMsg } from "/imports/utils/message.util";

/**
 * Creates a new widget with a single empty widget.
 *
 * @param {string} name - The name of the widget
 * @param {string} type - The type of the widget
 * @param {IUser} user - The user creating the widget
 * @param {() => void} handleRefresh - Function to call after the widget is created
 * @param {Object} [optional] - An object containing optional description
 * @param {string} [optional.description] - The description of the widget
 */
export const createWidget = (name: string, type: string, user: IUser, handleRefresh: () => void, optional: { description?: string }) => {
  const widget = {};

  Meteor.callAsync("widgetsInsert", { ...widget }).
    then((_id: string) => {
      successSaveMsg();
      handleRefresh();
    }).
    catch(catchErrorMsg);
};

/**
 * Deletes an widget by its _id.
 * 
 * This function makes an asynchronous call to remove the specified widget
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion fails,
 * a warning message is shown. Any errors during the process are caught and handled.
 * 
 * @param {string} _id - The unique identifier of the widget to delete.
 * @param {TIntl} intl - The internationalization object for localization.
 * @param {() => void} handleRefresh - Callback function to refresh the widget list after deletion.
 */
export const deleteWidget = (_id: string, intl: TIntl, handleRefresh: () => void) => {
  Meteor.callAsync('widgetRemove', { _id }).
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
 * Calls a Meteor method to fetch a list of widgets and
 * sets the provided state callback with the response.
 *
 * @param {string} method - The name of the Meteor method to call.
 * @param {(res: any[]) => void} setEntities - The state callback to set the widget list.
 * @param {{}} opts - An object of options to pass to the Meteor method.
 */
export const getWidgets = (method: string, setEntities: (res: any[]) => void, opts: {}) => {
  Meteor.callAsync(method, opts).then((res: any[]) => {
    setEntities(res);
  }).catch((e) => catchErrorMsg(e, () => setEntities([])));
};