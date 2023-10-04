/**
 * @Amplication example types file.
 * Add here all your typescript types/enum/interfaces
 */
// export interface Settings {
//   [key: string]: any;
// }

// export interface Settings {
//   host: string;
//   port: number;
//   user: string;
//   password: string;
//   dbName: string;
// }

export interface Settings {
  host: string;
  realm: string;
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  password: string;
  port: number;
  user: string;
};