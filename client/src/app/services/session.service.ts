import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class SessionService {
  serviceURL = environment.server_url + "/";
  constructor(private http: HttpClient) {}

  login(data) {
    const url: string = this.getServerURL("login");
    return this.http.post(url, data);
  }

  register(data) {
    const url: string = this.getServerURL("signup");
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
    const token = localStorage.getItem("token");
    return token != null;
  }

  validateToken(cb) {
    const err = new Error("Invalid token");
    const token = localStorage.getItem("token");
    if (!token) {
      return cb(err);
    }
    const headers = new HttpHeaders({"Authorization": `Bearer ${token}`});
    const url: string = this.getServerURL("authenticate");
    this.http.get(url, {
      headers
    }).subscribe(
      () => cb(null),
      e => cb(e)
    );
  }

  saveSession(data) {
    localStorage.setItem("token", data.token);
  }

  getServerURL(path: string): string {
    return this.serviceURL + path;
  }
}
