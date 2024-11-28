import { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook that redirects the user to a specified pathname if the user is logged in.
 *
 * @param {string} pathname - The pathname to redirect to when the user is authenticated.
 */
export const useAuthRedirect = (pathname: string): void => {
  const history = useNavigate();
  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    user?._id && history(pathname);
  }, [user?._id]);
}