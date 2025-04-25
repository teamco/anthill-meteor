import { useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { useNavigate } from "@tanstack/react-router";

/**
 * Custom hook that redirects the user to a specified pathname if the user is logged in.
 *
 * @param {string} pathname - The pathname to redirect to when the user is authenticated.
 */
export const useAuthRedirect = (pathname: string | any): void => {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());

  useEffect(() => {
    user?._id && navigate({ to: pathname });
  }, [user?._id]);
};
