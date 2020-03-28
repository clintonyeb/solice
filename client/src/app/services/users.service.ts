import { Injectable } from "@angular/core";
import { getServerURL } from "../utils/helpers";
import { HttpClientService } from './http-client.service';

@Injectable({
  providedIn: "root"
})
export class UsersService {
  constructor(private http: HttpClientService) {}

  getUser() {
    const url: string = getServerURL("user");
    return this.http.get(url);
  }
}
