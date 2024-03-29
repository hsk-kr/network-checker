# Network Checker

The code is only for development environment.

## How To run

### Prerequisite

- MongoDB

_If you have docker, you can simply create an instance with this command_

```bash
docker run --name some-mongo -p 27017:27017 -d mongo:latest
```

### Client

1. Move to client directory.
   ```
   cd client
   ```
2. Install packages
   ```
   npm install
   ```
3. Run
   ```
   npm run dev
   ```

### Admin Page

1. Move to admin-page directory.
   ```
   cd client
   ```
2. Install packages
   ```
   npm install
   ```
3. Run
   ```
   npm run start
   ```

### Server

1. Move to server directory.
   ```
   cd server
   ```
2. Install packages
   ```
   npm install
   ```
3. Run
   ```
   npm run start:dev
   ```

- Scripts
  - start:dev - start server dev server which detects file changed automatically and restarts.
  - build:production - build
  - start:production - start server in production mode
  - start - build and start server in production mode

### Checker

1. Move to checker directory.
   ```
   cd checker
   ```
2. Install packages
   ```
   npm install
   ```
3. Run
   ```
   npm run start [socket-count | timeout | delay]
   ```

- Command Options
  - socket-count : How many sockets you use
  - timeout : How long a socket waits to response from an endpoint until it decides timeout
  - delay : Interval time to check network connections

## Stacks

### Client

- React
- Bootstrap 4

### Admin Page

- react-admin (https://github.com/marmelab/react-admin)

### Server

- Express
- Mongoose

### Checker

- Typescript

### Database

- MongoDB

## Preview

![Preview](https://github.com/hsk-kr/network-checker/blob/master/screenshot/preview.gif?raw=true)
