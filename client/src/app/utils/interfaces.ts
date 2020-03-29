export interface INotify {
  type: string;
  message: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  username: string;
  _id: string;
  bio: string;
  profile_pic: string;
  lastLogin: Date;
  role: string;
  dob: IDOB;
  token: string;
}
export interface IDOB {
  day: number;
  month: number;
  year: number;
}

export interface Message {
  userId: string;
  token: string;
}

export interface IComment {
  text: string;
  created: Date;
  postedBy: IUser;
}

export interface IPost {
  text: string;
  photo: string;
  likes: Array<IUser>;
  comments: Array<Comment>;
  postedBy: IUser;
  created: Date;
}
