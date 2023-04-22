# youtube-server

## Installation

```bash
    npm install
```

or

```bash
    yarn add
```

## Config enviroment variables

-   Create .env file in the root directory

```bash
    PORT_SERVER = your_port
    ORIGIN_CLIENT_DOMAIN = your_client_domain
    ORIGIN_ADMIN_DOMAIN = your_admin_domain
    DATABASE_URL = your_database_url(mongoDB compass)
    CLIENT_ID_GOOGLE = 163547023369-dq2t6l2846mnl4sqb1ijtuak6gdhpagb.apps.googleusercontent.com
    CLIENT_SECRET_GOOGLE = http://localhost:5000/api/auth/google/callback
    JWT_TOKEN_SECRET_KEY = your_secret_token
    ADMIN_PUBLIC_KEY = your_admin_public_key
```

-   Generate token by command

```
    node
    require('crypto').randomBytes(64).toString('hex')
```

## Development mode

```bash
    npm run dev
```

or

```bash
    yarn dev
```
