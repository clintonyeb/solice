// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  server_url: "http://localhost:3000/api/v1",
  WEB_SOCKET_URL: "ws://localhost:3000/ws",
  FILE_UPLOAD: "4ef91c4509b63866a03c9aee317920eb",
  CAPTCHA_SITE_KEY: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
};
