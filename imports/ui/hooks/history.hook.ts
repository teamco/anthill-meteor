import { useEffect, useMemo } from "react";
import { NavigationType, useLocation, useNavigationType } from "react-router-dom";

/**
 * This hook is used to listen to route changes and write the history data to the server.
 * It uses the useLocation and useNavigationType hooks from react-router-dom to get the current location and navigation type.
 * It then uses the useMemo hook to create a memoized object with the location and navigation type.
 * The useEffect hook is used to write the data to the server when the location or navigation type changes.
 * The data is written to the server with a call to the userLogInsert Meteor method.
 * The method is called with the memoized data object and an additional metadata object with the current date and time and the user id.
 * The useEffect hook is also used to prevent the hook from writing data on every render, by only writing data when the location.key is not equal to "default".
 * The skipOn array is used to skip writing data on certain routes.
 * @returns {void}
 */
export const useHistoryListener = (): void => {
  const location = useLocation();
  const navType: NavigationType = useNavigationType();

  const data = useMemo(() => ({ location, navType }), [location.pathname, navType]);

  useEffect(() => {
    const skipOn = [
      'userLogs',
      'errorLogs',
    ]

    if (location.key !== "default" && !skipOn.find((path: string) => location.pathname.match(path))) {
      Meteor.call('userLogInsert', { ...data });
    }
  }, [JSON.stringify(data)]);
};