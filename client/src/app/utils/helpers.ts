import { environment } from "environments/environment";

export function getServerURL(path: string): string {
  return environment.server_url + '/' + path;
}


export function getAdminServerURL(path: string): string {
  return environment.server_url + "/admins/" + path;
}
