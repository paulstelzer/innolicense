import { UserModel } from './user.model';
// Actions
export class UserSignIn {
  static type = '[User] Sign in';
  constructor(public email: string, public password: string) {}
}

export class UserRegister{
  static type = '[User] Register';
  constructor(public email: string, public password: string, public vendor: boolean) {}
}

export class UserDelete {
  static type = '[User] UserDelete';
}

export class UserSignOut {
  static type = '[User] Sign out';
}

// Events
export class SignInSuccess {
  static type = '[User] Sign in successful';
  constructor(public token: string) {}
}

export class RegisterSuccess {
  static type = '[User] RegisterSuccess';
  constructor(public user: UserModel) {}
}


export class UserSuccess {
  static type = '[User] UserSuccess';
  constructor(public user: UserModel) {}
}

export class UserNull {
  static type = '[User] UserNull';
}

export class UserFailed {
  static type = '[User] UserFailed';
  constructor(public message: string = '') {}
}
