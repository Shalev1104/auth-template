# Auth Template

This repository contains a comprehensive authentication template built with NestJS and Typescript.
It includes various login methods and two-factor authentication (2FA).
This template Serves as an excellent starting point, a reference for best practices, or a solid foundation for building your custom authentication system.

## Features

- **Login Methods**
  - Email and Password
  - Google
  - Github
  - Facebook
- **Two-Factor Authentication Channels**

  - Authenticator App (TOTP)
  - Email
  - Phone Call
  - SMS

- **Extensible and Adaptable**: Built without external authentication libraries, allowing easy adaptation and customization.
- **Event-Driven Architecture**: Utilizes events for handling user actions.
- **Authorization Access Control**: Allows managing permissions for authorizing with any login method.
- **Error Handling**: Consistent and processed in an appropriate manner.
- **Rate Limiting**: Secure protection against abuse and ensure fair usage.

# Utilities

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **In-Memory Database**: Redis
- **Validation**: Zod
- **SMS and Voice Communication**: Twilio
- **Email Communication**: Nodemailer

# Getting Started

1. **Clone the repository**

   ```
   git clone https://github.com/Shalev1104/auth-template
   cd auth-template
   ```

2. **Install dependencies**
   ```
   npm install
   ```
3. **Set up environment variables**

   - Run the following command to copy the example environment file

     ```
     npm run env:copy
     ```

   - Fill in the environment variables in the `.env` file.
     For more details, refer to the [environment documentation file](./docs/environment.md).

4. **Create Docker containers**
   ```
   docker-compose up -d
   ```
5. **Seeding the database**
   ```
   npm run seed:run
   ```
6. **Run the server**
   ```
   npm run start:dev
   ```

## License

This project is licensed under the [MIT license](LICENSE).
