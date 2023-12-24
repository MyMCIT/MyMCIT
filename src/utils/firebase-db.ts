import { initializeApp } from "firebase/app";
import {
  child,
  connectDatabaseEmulator,
  get,
  getDatabase,
  onValue,
  ref,
} from "firebase/database";
// import {
//   getFirestore,
//   connectFirestoreEmulator,
//   query,
//   collection,
//   getDocs,
// } from "firebase/firestore";
// import { getAuth, connectAuthEmulator } from "firebase/auth";
// import { getApp } from "firebase/app";
// import { useSetColorMode } from "../context/customHooks.ts";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_AP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// useful realtime db tutorial https://webkul.com/blog/implementation-of-firebase-real-time-database-in-react/

// want to leave gets unprotected and create, update, delete protected? Have to edit firebase config to do this

// Initialize firebase app.
const app = initializeApp(firebaseConfig);

// Initialize firebase database and get the reference of firebase database object.
const database = getDatabase(app);

// if running npm run dev, the application will try and connect to the local firebase real time database emulator
// https://firebase.google.com/docs/emulator-suite/install_and_configure
if (location.hostname === "localhost" && import.meta.env.VITE_MODE === "dev") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(database, "127.0.0.1", 9000);
}

// These helper methods automatically account for authorization

/**
 * Fetch new course from the db
 * @param force - force reset the cache in session storage. Do not do this unless we have to
 */
export const fetchCourses = async () => {
  // handle fetching course from session storage cache
  let reviews = JSON.parse(sessionStorage.getItem("courses") ?? "");

  if (reviews != null) {
    return reviews;
  } else {
    try {
      let snapshot = await get(child(ref(database), "/courses"));
      console.log("Fetching course reviews");

      if (snapshot.exists()) {
        sessionStorage.setItem("courses", JSON.stringify(snapshot.val()));
        return snapshot.val();
      } else {
        console.log("Data not available");
        return;
      }
    } catch (error) {
      console.error(error);
    }
  }
};

// export const fireBaseGetOnce = (path: string) => {
//   get(child(ref(database), path))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         console.log(data);
//       } else {
//         console.log("Data not available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

export const firebaseReadRealTime = () => {
  onValue(ref(database), (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      console.log("real time");
      console.log(data);
    } else {
      console.log("Data not found");
    }
    return data;
  });
};

/**
 * Creates a new item at the given path
 * This will override all the data at the given path
 */
// export const firebaseSet = (path: string, data: any) => {
//   set(ref(database, path), data)
//     .then(() => {
//       // Success.
//       console.log("success");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

/**
 * Will create an item at the given path
 * @param path - item to be created
 * @param data - to be added
 * @param updateCourseCache
 */
// export const createItem = (
//   path: string,
//   data: any,
//   updateCourseCache = false
// ) => {
//   const updates = {};
//
//   const newItemKey = push(child(ref(database), path)).key;
//
//   // @ts-ignore
//   updates[path + newItemKey] = data;
//
//   update(ref(database), updates)
//     .then(() => {
//       // Success
//
//       if (updateCourseCache) {
//         fetchCourses(true);
//       }
//       console.log("success");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// export const firebaseUpdate = (id: number) => {
//   const updates = {};
//
//   // TODO - not sure if this is the right syntax
//   // @ts-ignore
//   updates["/test/courses/" + id] = { courseID: "CIT594", time: 10.25 };
//
//   update(ref(database), updates)
//     .then(() => {
//       // Success
//       console.log("success");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// export const firebaseDeleteByID = (id: number) => {
//   // TODO - will have to make this dynamic, just an example
//
//   const delete_string = `test/courses/${id}`;
//   remove(ref(database, delete_string))
//     .then(() => {
//       console.log("success");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// export const firebaseDeleteAll = () => {
//   const delete_string = `test/courses/`;
//   remove(ref(database, delete_string))
//     .then(() => {
//       console.log("success");
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
