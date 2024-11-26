import { WidgetsCollection } from "/imports/collections/widgets.collection";
import { TWidget } from "/imports/config/types";
import { t, TIntl } from "/imports/utils/i18n.util";

import { successSaveMsg, catchErrorMsg, successDeleteMsg, catchWarnMsg } from "/imports/utils/message.util";

/**
 * Creates a new widget in the database.
 * 
 * This function makes an asynchronous call to add the specified widget
 * to the collection. Upon successful creation, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the creation fails,
 * a warning message is shown. Any errors during the process are caught and handled.
 * 
 * @param {TWidget} widget - The widget object to create.
 * @param {() => void} handleRefresh - Callback function to refresh the widget list after creation.
 */
export const createWidget = (widget: TWidget, handleRefresh: () => void) => {
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

/**
 * Finds a widget in the collection by a specified key and value.
 *
 * @param {string} key - The key to search for in the collection.
 * @param {string} value - The value to match for the specified key.
 * @returns {TWidget} The widget found in the collection or undefined if not found.
 */
export const getWidgetBy = (key: string, value: string): TWidget => 
  WidgetsCollection.findOne({ [key]: value }) as TWidget;