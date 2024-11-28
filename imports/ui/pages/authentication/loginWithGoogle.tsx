import { Meteor } from "meteor/meteor";
import React from "react";
import { useGoogleLogin } from '@react-oauth/google';

export const LoginWithGoogle = () => {

  const handleGoogleLogin = useGoogleLogin({
    scope:'profile email',
    onSuccess: (tokenResponse) => {
      debugger
      Meteor.call('googleProfile', tokenResponse);
      console.log('Login Success:', tokenResponse);
    },
    onError: error => {
      console.log('Login Failed:', error);
    }
  });

  return (
    <button type="button" className="google-btn" onClick={handleGoogleLogin}>
      Login with Google    
    </button>
  );
};