# Network Checker

네트워크 상태를 주기적으로 확인 해주는 서비스 입니다. Restful API 서버 포트폴리오 목적으로 제작되었습니다.

## How To run

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
    npm run start
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
    npm run start
    ```

### Checker

1. Move to a client directory.
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

* Command Options
    - socket-count : Count of sockets that to use to connect at a one time.
    - timeout : Timeout
    - delay : How long wait after checking all of check information.

## Skill Stacks

### Client

- React (CRA based)
- Redux
- Bootstrap 4

### Admin Page

- react-admin (https://github.com/marmelab/react-admin)

### Server

- Node.js (Express.js)
- Mongoose

### Checker

- Node.js

### Database

- MongoDB