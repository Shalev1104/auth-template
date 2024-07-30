| Variable                 | Description                                                | Example Value                 |
| ------------------------ | ---------------------------------------------------------- | ----------------------------- |
| `NODE_ENV`               | The environment in which the app is running.               | `development` or `production` |
| `PORT`                   | The port for your backend hosted process.                  | `3000`                        |
| DB Configuration         |                                                            |                               |
| `POSTGRES_CLIENT`        | The client used for connecting to the PostgreSQL database. | `postgresql`                  |
| `POSTGRES_DATABASE`      | The name of the PostgreSQL database.                       | `auth_db`                     |
| `POSTGRES_HOST`          | The host address of the PostgreSQL server.                 | `localhost`                   |
| `POSTGRES_PORT`          | The port on which PostgreSQL is running.                   | `5432`                        |
| `POSTGRES_USER`          | The username for accessing the PostgreSQL database.        | `db_user`                     |
| `POSTGRES_PASSWORD`      | The password for accessing the PostgreSQL database.        | `password`                    |
| Redis Configuration      |                                                            |                               |
| `REDIS_HOST`             | The host address of the Redis server.                      | `localhost`                   |
| `REDIS_PASS`             | The password for accessing the Redis server.               | `password`                    |
| `REDIS_PORT`             | The port on which Redis is running.                        | `6379`                        |
| Application Secrets      |                                                            |                               |
| `TOKEN_SECRET`           | Secret key for JWT token signature.                        | `secret`                      |
| `COOKIE_PARSER_SECRET`   | Secret key for parsing cookies.                            | `secret`                      |
| `ENCRYPTION_KEY`         | Secret key for data encryption.                            | `secret`                      |
| Rate Limiting            |                                                            |                               |
| `TTL_IN_MILLISECONDS`    | Time to live for a request in milliseconds.                | `300000`                      |
| `REQUEST_LIMIT_PER_TTL`  | Number of requests allowed per TTL.                        | `1000`                        |
| CORS                     |                                                            |                               |
| `CORS_ALLOW_ORIGINS`     | Frontend address to allow requests.                        | `https://localhost:8080`      |
| OAuth2 Configuration     |                                                            |                               |
| `GOOGLE_CLIENT_ID`       | Google OAuth2 Client ID.                                   | `your_google_client_id`       |
| `GOOGLE_CLIENT_SECRET`   | Google OAuth2 Client Secret.                               | `your_google_client_secret`   |
| `GITHUB_CLIENT_ID`       | GitHub OAuth2 Client ID.                                   | `your_github_client_id`       |
| `GITHUB_CLIENT_SECRET`   | GitHub OAuth2 Client Secret.                               | `your_github_client_secret`   |
| `FACEBOOK_CLIENT_ID`     | Facebook OAuth2 Client ID.                                 | `your_facebook_client_id`     |
| `FACEBOOK_CLIENT_SECRET` | Facebook OAuth2 Client Secret.                             | `your_facebook_client_secret` |
| SMTP Configuration       |                                                            |                               |
| `MAIL_SERVICE`           | The email service provider.                                | `gmail`                       |
| `MAIL_HOST`              | The host address of the email service.                     | `smtp.gmail.com`              |
| `MAIL_PORT`              | The port on which the email service is running.            | `465`                         |
| `MAIL_USER`              | The username for accessing the email service.              | `your_email@example.com`      |
| `MAIL_PASSWORD`          | The password for accessing the email service.              | `your_email_password`         |
| `MAIL_FROM`              | The default email address to send emails from.             | `no-reply@example.com`        |
| Twilio Configuration     |                                                            |                               |
| `TWILIO_ACCOUNT_SID`     | Twilio account SID.                                        | `your_twilio_account_sid`     |
| `TWILIO_AUTH_TOKEN`      | Twilio authentication token.                               | `your_twilio_auth_token`      |
| `TWILIO_PHONE_NUMBER`    | Twilio phone number to send messages from.                 | `+1234567890`                 |

> [!Note]
> When configuring OAuth 2, ensure you enter the following information:

- Homepage URL: application base URL (for example: http://localhost:3000)
- Redirect/Callback URL: application base URL + /auth/oauth/connect/[provider]/callback (for example: http://localhost:3000/auth/oauth/connect/google/callback)

References:
[Google OAuth 2](https://support.google.com/cloud/answer/6158849)
[Facebook OAuth 2](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/#clienttokens)
[Github OAuth 2](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authenticating-to-the-rest-api-with-an-oauth-app#registering-your-app)
[Twilio](https://www.twilio.com/docs/usage/tutorials/how-to-use-your-free-trial-account-namer)
