import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  get(url) {
    return this.http.get(url, {
      headers: this.getHeaders()
    });
  }

  post(url, data) {
    return this.http.post(url, data, {
      headers: this.getHeaders()
    });
  }

  put(url, data) {
    return this.http.put(url, data, {
      headers: this.getHeaders()
    });
  }

  delete(url) {
    return this.http.delete(url, {
      headers: this.getHeaders()
    });
  }

  getHeaders() {
    const token = sessionStorage.getItem("token");
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
