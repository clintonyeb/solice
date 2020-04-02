import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { getServerURL } from "../utils/helpers";

@Injectable()
export class SessionService {
  userId: string;
  constructor(private http: HttpClient) {
    this.userId = sessionStorage.getItem("userId");
  }

  login(data) {
    const url: string = getServerURL("login");
    return this.http.post(url, data);
  }

  register(data) {
    const url: string = getServerURL("signup");
    return this.http.post(url, data);
  }

  handleError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    } else if (error.error) {
      return error.error.error;
    }
    return "Something bad happened; please try again later.";
  }

  hasToken(): boolean {
    const token = sessionStorage.getItem("token");
    return token != null;
  }

  validateToken(cb) {
    const err = new Error("Invalid token");
    const token = sessionStorage.getItem("token");
    if (!token) {
      return cb(err);
    }
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url: string = getServerURL("authenticate");
    this.http
      .get(url, {
        headers
      })
      .subscribe(
        data => cb(null, data),
        e => cb(e)
      );
  }

  saveSession(data) {
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("userId", data._id);
  }

  makePost(url, data) {
    return this.http.post(url, data);
  }
}
