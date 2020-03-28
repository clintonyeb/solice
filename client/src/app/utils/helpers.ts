import { environment } from "environments/environment";

export function getServerURL(path: string): string {
  return environment.server_url + '/' + path;
}
