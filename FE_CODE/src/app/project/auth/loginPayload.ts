export class LoginPayload {
  email: string;
  password: string;
  constructor() {
    this.email = 'tungle@gmail.com';
    this.password = `${new Date().getTime()}`;
  }
}
