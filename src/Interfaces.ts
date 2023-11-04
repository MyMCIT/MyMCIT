export interface UserData {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
  phone: string;
  cell: string;
  id: {
    name: string;
    value: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export interface Course {
  courseID: string;
  courseName: string;
  reviews: Review[];
}

export interface Review {
  Comment: string;
  "Course Name": string;
  Difficulty: string;
  Rating: string;
  Semester: string;
  Workload: string;
}

// Information provided from firebase about the logged in user
export interface UserInfo {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  /**
   * The user's unique ID.
   */
  uid: string;
}
