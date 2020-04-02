import { Injectable } from "@angular/core";
import { HttpClientService } from "./http-client.service";
import { Router } from "@angular/router";
import { getAdminServerURL } from "../utils/helpers";

@Injectable({
  providedIn: "root"
})
export class AdminsService {
  constructor(private http: HttpClientService, private router: Router) {}

  getPosts(page?: number) {
    let url;
    if (page) url = `posts?page=${page}`;
    else url = "posts";
    url = getAdminServerURL(url);
    return this.http.get(url);
  }

  enablePost(id: string) {
    const url = getAdminServerURL(`posts/${id}`);
    return this.http.put(url, { status: 0 });
  }

  disablePost(id: string) {
    const url = getAdminServerURL(`posts/${id}`);
    return this.http.put(url, { status: 1 });
  }

  deletePost(id: string) {
    const url = getAdminServerURL(`posts/${id}`);
    return this.http.delete(url);
  }

  getUsers(page?: number) {
    let url;
    if (page) url = `users?page=${page}`;
    else url = "users";
    url = getAdminServerURL(url);
    return this.http.get(url);
  }

  enableUser(id: string) {
    const url = getAdminServerURL(`users/${id}`);
    return this.http.put(url, { status: 0 });
  }

  disableUser(id: string) {
    const url = getAdminServerURL(`users/${id}`);
    return this.http.put(url, { status: 1 });
  }

  getFilters(page?: number) {
    const url = getAdminServerURL("words");
    return this.http.get(url);
  }

  deleteFilters(id: string) {
    const url = getAdminServerURL(`words/${id}`);
    return this.http.delete(url);
  }

  addFilters(filters) {
    const url = getAdminServerURL(`words`);
    return this.http.post(url, filters);
  }

  getRequests() {
    const url = getAdminServerURL("users/requests");
    return this.http.get(url);
  }
}
