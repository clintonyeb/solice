import { Injectable } from "@angular/core";
import { getServerURL } from "../utils/helpers";
import { HttpClientService } from "./http-client.service";
import { environment } from "../../environments/environment";
import { Subject, BehaviorSubject } from "rxjs/Rx";
import { Router } from "@angular/router";
import { INotification } from "../utils/interfaces";

@Injectable()
export class UsersService {
  private socket: WebSocket;
  public activeSubject = new BehaviorSubject<boolean>(false);
  public notificationSubject = new BehaviorSubject<Array<INotification>>([]);

  constructor(private http: HttpClientService, private router: Router) {}

  getUser() {
    const url: string = getServerURL("user");
    return this.http.get(url);
  }

  getUsers() {
    const url: string = getServerURL("users");
    return this.http.get(url);
  }

  getUsersFilter(type) {
    const url: string = getServerURL(`users?type=${type}`);
    return this.http.get(url);
  }

  getUserById(id) {
    let url: string = `user/${id}`;
    url = getServerURL(url);
    return this.http.get(url);
  }

  closeConnections() {
    this.socket.close();
    this.socket = null;
  }

  addNotification(notification) {
    const past = this.notificationSubject.value;
    if (past.length > 10) past.shift();
    const updatedValue = [notification, ...past];
    this.notificationSubject.next(updatedValue);
  }

  goActive() {
    const url = environment.WEB_SOCKET_URL;
    const message = {
      token: sessionStorage.getItem("token")
    };
    this.socket = new WebSocket(url);
    this.socket.onopen = e => {
      console.log("Successfully connected: " + url);
      this.socket.send(JSON.stringify(message));
      this.activeSubject.next(true);
    };

    this.socket.onmessage = e => {
      console.log(`[message] Data received from server: ${e.data}`);
      const data = JSON.parse(e.data);
      if (data.type === "notifications") {
        this.addNotification(data.data);
      } else {
        this.activeSubject.next(true);
      }
    };

    this.socket.onclose = event => {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log("[close] Connection died");
      }
      this.activeSubject.next(false);
    };

    this.socket.onerror = error => {
      console.log(`[error] ${error["message"]}`);
      this.activeSubject.next(false);
    };
  }

  createPost(post) {
    const url: string = getServerURL("posts");
    return this.http.post(url, post);
  }

  getPosts(page?: number) {
    let url;
    if (page) url = `posts?page=${page}`;
    else url = "posts";
    url = getServerURL(url);
    return this.http.get(url);
  }

  getFeed(page?: number) {
    let url;
    if (page) url = `feed?page=${page}`;
    else url = "feed";
    url = getServerURL(url);
    return this.http.get(url);
  }

  followUser(userId) {
    const url: string = getServerURL("users/follow");
    return this.http.post(url, { _id: userId });
  }

  unFollowUser(userId) {
    const url: string = getServerURL("users/unfollow");
    return this.http.post(url, { _id: userId });
  }

  searchPeople(query, type) {
    const url: string = getServerURL(
      `users/search?query=${query}&type=${type}`
    );
    return this.http.get(url);
  }

  searchFeed(query, type, page?: number) {
    const url: string = getServerURL(
      `feed/search?query=${query}&type=${type}&page=${page}`
    );
    return this.http.get(url);
  }

  searchPosts(query) {
    const url: string = getServerURL(`posts/search?query=${query}`);
    return this.http.get(url);
  }

  likePost(postId) {
    const url = getServerURL("posts/like");
    return this.http.post(url, { postId });
  }

  commentPost(postId, text) {
    const url = getServerURL("posts/comment");
    return this.http.post(url, { postId, text });
  }

  getComments(postId) {
    const url = getServerURL(`posts/${postId}/comments`);
    return this.http.get(url);
  }

  deleteComment(postId, commentId) {
    const url = getServerURL(`posts/${postId}/comments/${commentId}`);
    return this.http.delete(url);
  }

  logout() {
    const url: string = getServerURL("logout");
    return this.http.get(url).subscribe(res => {
      this.socket && this.socket.close();
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userId");

      this.router.navigate([
        "/session/login",
        { message: "You have been logged out..." }
      ]);
    });
  }

  updateUser(user) {
    const url: string = getServerURL("users");
    return this.http.put(url, user);
  }

  getNotifications() {
    const url: string = getServerURL("users/notifications");
    return this.http.get(url);
  }

  getActive() {
    const url: string = getServerURL("users/active");
    return this.http.get(url);
  }

  getAds() {
    const url: string = getServerURL("users/ads");
    return this.http.get(url);
  }
}
