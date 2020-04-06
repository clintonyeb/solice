import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { getServerURL } from "../utils/helpers";
import { BehaviorSubject } from "rxjs/Rx";
import { IUser } from "../utils/interfaces";

@Injectable()
export class SessionService {
  public currentUserSubject = new BehaviorSubject<IUser>(null);

  constructor(private http: HttpClient) {
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
    console.log(error.error);
    if (error.error instanceof ErrorEvent) {
      return error.error.message;
    } else if (error.error.message) {
      return error.error.message;
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
        headers,
      })
      .subscribe(
        (data: IUser) => {
          this.currentUserSubject.next(data);
          cb(null, data);
        },
        (e) => cb(e)
      );
  }

  saveSession(data) {
    sessionStorage.setItem("token", data.token);
  }

  makePost(url, data) {
    return this.http.post(url, data);
  }

  submitRequest(request) {
    const url: string = getServerURL("requests");
    return this.http.post(url, request);
  }

  forgotPassword(data) {
    const url: string = getServerURL("forgot_password");
    return this.http.post(url, data);
  }

  resetPassword(data) {
    const url: string = getServerURL("reset_password");
    return this.http.post(url, data);
  }
}
