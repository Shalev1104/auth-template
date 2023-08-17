export enum Routers {
  Auth = 'auth',
  Users = 'users',
  Trees = 'trees',
}

export namespace RouterRoutes {
  export enum Auth {
    Register = 'register',
    Login = 'login',
    Logout = 'logout',
    RefreshToken = 'refresh',
    Github = 'github',
    Google = 'google',
  }
  export enum User {
    Claims = 'claims',
  }
}
