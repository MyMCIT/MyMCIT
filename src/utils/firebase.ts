import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  update,
  remove,
  onValue,
} from "firebase/database";

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

// useful reatltime db tutorial https://webkul.com/blog/implementation-of-firebase-real-time-database-in-react/

// TODO - must integrate firebase auth into this
// want to leave gets unprotected and create, update, delete protected? Have to edit firebase config to do this

// Initialize firebase app.
const app = initializeApp(firebaseConfig);

// Initialize firebase database and get the reference of firebase database object.
const database = getDatabase(app);

const testCourses = {
  0: {
    courseID: "CIT591",
  },
  1: {
    courseID: "CIT592",
  },

  2: {
    courseID: "CIT593",
  },
};

export const fireBaseGetOnce = (path: string) => {
  get(child(ref(database), path))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        console.log(data);
      } else {
        console.log("Data not available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const firebaseReadRealTime = () => {
  onValue(ref(database, "test/courses"), (snapshot) => {
    const data = snapshot.val();
    if (!!data) {
      console.log("real time");
      console.log(data);
    } else {
      console.log("Data not found");
    }
  });
};

export const firebaseSet = () => {
  set(ref(database, "test/courses/"), testCourses)
    .then(() => {
      // Success.
      console.log("success");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const firebaseUpdate = (id: number) => {
  const updates = {};

  // TODO - not sure if this is the right syntax
  // @ts-ignore
  updates["/test/courses/" + id] = { courseID: "CIT594", time: 10.25 };

  update(ref(database), updates)
    .then(() => {
      // Success
      console.log("success");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const firebaseDeleteByID = (id: number) => {
  // TODO - will have to make this dynamic, just an example

  let delete_string = `test/courses/${id}`;
  remove(ref(database, delete_string))
    .then(() => {
      console.log("success");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const firebaseDeleteAll = () => {
  let delete_string = `test/courses/`;
  remove(ref(database, delete_string))
    .then(() => {
      console.log("success");
    })
    .catch((error) => {
      console.log(error);
    });
};
