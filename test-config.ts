export const testConfig = {
  credentials: {
    admin: {
      username: "username",
      password: "password"
    }
  },
  baseUrl: "https://core1-release.sharedo.co.uk"
};

export type TestCredentials = {
  username: string;
  password: string;
}; 