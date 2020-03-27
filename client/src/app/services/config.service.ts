import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
  configUrl = "assets/config.json";
  config = null;
  constructor(private http: HttpClient) {
    this.getConfig();
  }

  getConfig() {
    return this.http.get(this.configUrl).subscribe((data) => this.config = data);
  }

  getServerURL(url: string): string {
    return this.config.server_url + '/' + url;
  }
}
