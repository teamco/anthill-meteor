import { t, TIntl } from "/imports/utils/i18n.util";
import { catchErrorMsg, successDeleteMsg, catchWarnMsg } from "/imports/utils/message.util";

/**
 * Deletes an layout by its _id.
 * 
 * This function makes an asynchronous call to remove the specified layout
 * from the collection. Upon successful deletion, a success message is displayed
 * and the handleRefresh function is called to update the UI. If the deletion fails,
 * a warning message is shown. Any errors during the process are caught and handled.
 * 
 * @param {string} _id - The unique identifier of the layout to delete.
 * @param {TIntl} intl - The internationalization object for localization.
 * @param {() => void} handleRefresh - Callback function to refresh the layout list after deletion.
 */
export const deleteLayout = (_id: string, intl: TIntl, handleRefresh: () => void) => {
  Meteor.callAsync('layoutRemove', { _id }).
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