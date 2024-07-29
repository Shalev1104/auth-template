# Auth Template
This repository contains a comprehensive authentication template built with NestJS and Typescript. 
It includes various login methods and two-factor authentication (2FA). 
Serving as an excellent starting point, a reference for best practices, or a solid foundation for building your custom authentication system, this template is designed to meet diverse authentication needs.

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

- **Extensible and Adaptable** Built without external authentication libraries, allowing easy adaptation and customization.
- **Event-Driven Architecture** Utilizes events for handling user actions.
- **Authorization Access Control** Allows managing permissions for authorizing with any login method.
- **Error Handling** Consistent and processed in an appropriate manner.
- **Rate Limiting** Secure protection against abuse and ensure fair usage.

# Utilities
* **Framework**: NestJS
* **Database**: PostgreSQL
* **ORM**: TypeORM
* **In-Memory Database**: Redis
* **Validation**: Zod
* **SMS and Voice Communication**: Twilio
* **Email Communication**: Nodemailer
