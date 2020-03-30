import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HttpClientService {
  headers;
  constructor(private http: HttpClient) {
    const token = localStorage.getItem("token");
    this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  get(url) {
    return this.http.get(url, {
      headers: this.headers
    });
  }

  post(url, data) {
    return this.http.post(url, data, {
      headers: this.headers
    });
  }

  put(url, data) {
    return this.http.put(url, data, {
      headers: this.headers
    });
  }

  delete(url) {
    return this.http.delete(url, {
      headers: this.headers
    });
  }
}
