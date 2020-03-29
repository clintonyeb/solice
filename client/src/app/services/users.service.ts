import { Injectable } from "@angular/core";
import { getServerURL } from "../utils/helpers";
import { HttpClientService } from "./http-client.service";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Rx";
import { IPost } from "../utils/interfaces";

@Injectable({
  providedIn: "root"
})
export class UsersService {
  socket;
  constructor(private http: HttpClientService) {}

  getUser() {
    const url: string = getServerURL("user");
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
}
