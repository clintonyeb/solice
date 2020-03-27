import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ConfigService } from "./config.service";

@Injectable()
export class SessionService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  login(data) {
    const url: string = this.configService.getServerURL("login");
    return this.http.post(url, data);
  }

  register(data) {
    const url: string = this.configService.getServerURL("signup");
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
    if (!token) { return cb(err); }
    const url: string = this.configService.getServerURL("validate-token");
    this.http.get(url).subscribe(() => cb(null), (e) => cb(e));
  }

  saveSession(data) {
    localStorage.setItem('token', data.token);
  }
}
