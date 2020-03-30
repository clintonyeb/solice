import { Injectable } from "@angular/core";
import { getServerURL } from "../utils/helpers";
import { HttpClientService } from "./http-client.service";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Rx";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  socket;
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

  goActive(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      const url = environment.WEB_SOCKET_URL;
      const message = {
        token: localStorage.getItem("token")
      };
      this.socket = new WebSocket(url);

      this.socket.onopen = e => {
        console.log("Successfully connected: " + url);
        this.socket.send(JSON.stringify(message));
        console.log("calling true");
        observer.next(true);
      };

      this.socket.onmessage = e => {
        console.log(`[message] Data received from server: ${e.data}`);
        observer.next(true);
      };

      this.socket.onclose = function(event) {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          );
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log("[close] Connection died");
        }
        observer.next(false);
      };

      this.socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
        observer.next(false);
      };
    });
  }

  createPost(post) {
    const url: string = getServerURL("posts");
    return this.http.post(url, post);
  }

  getPosts() {
    const url: string = getServerURL("posts");
    return this.http.get(url);
  }

  getFeed() {
    console.log(this);
    const url: string = getServerURL("feed");
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

  visitUser(userId) {}

  searchPeople(query, type) {
    const url: string = getServerURL(
      `users/search?query=${query}&type=${type}`
    );
    return this.http.get(url);
  }

  searchFeed(query, type) {
    const url: string = getServerURL(`feed/search?query=${query}&type=${type}`);
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
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

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
}
