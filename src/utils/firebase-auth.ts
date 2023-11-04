import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { UserInfo } from "../Interfaces.ts";

const auth = getAuth();
const provider = new GoogleAuthProvider();

export const handleSignIn = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // @ts-ignore
      const token = credential.accessToken;
      // The signed-in user info.
      const user: UserInfo = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      console.log(credential);
      console.log({ token });
      console.log({ user });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log({ errorCode });
      console.log({ errorMessage });
      console.log({ email });
      console.log({ credential });
    });
};

export const dumpSignedInUser = () => {
  const auth = getAuth();
  console.log(auth.currentUser);
  auth.currentUser?.getIdToken().then((res) => {
    console.log(res);
  });
};

export const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("sign out successful");
    })
    .catch((error) => {
      console.log(error);
    });
};
