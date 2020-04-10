export interface INotify {
  type: string;
  message: string;
}

interface IRequest {
  _id: string;
  status: number;
  text: string;
  created: Date;
}

export interface IUser {
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  _id: string;
  bio: string;
  profile_pic: string;
  lastLogin: Date;
  role: number;
  dob: IDOB;
  token: string;
  status: number;
  requests: Array<IRequest>;
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
  _id: string;
  text: string;
  created: Date;
  postedBy: IUser;
}

export interface IPost {
  _id: string;
  text: string;
  photo: string;
  likes: Array<IUser>;
  comments: Array<IComment>;
  postedBy: IUser;
  created: Date;
  status: number;
}

export interface INotification {
  type: number;
  targetUser: IUser;
  postedBy: IUser;
  created: Date;
  targetPost: IPost;
  status: boolean;
}

export interface IFilter {
  _id: string;
  text: string;
}

export interface IAd {
  _id: string;
  text: string;
  url: string;
  image: string;
  created: Date;
}

export interface ITarget {
  field: string;
  operator: string;
  value: string;
}
