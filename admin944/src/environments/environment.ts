// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: '3.0.4',
  build: 1,
  maximumFileSize: 15,
  apiBaseUrl: 'https://v2-api.livelearn.info/v1',
  // apiBaseUrl: 'http://localhost:9000/v1',
  platform: 'admin'
};
