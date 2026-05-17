flowchart LR
    Operator[User / Operator]

    subgraph Frontend[Frontend - React + TypeScript]
        Pages[Pages<br/>Login, Signup, Dashboard, LiDAR Summary, Audit Logs, Users]
        Components[Components<br/>Navbar, Button, MapGrid, Tables, Status Cards]
        Hooks[Hooks<br/>useTelemetry]
        Services[Axios API Service]
        AuthStorage[LocalStorage Auth Utils]
    end

    subgraph Backend[Backend - Node.js + Express]
        App[Express App]
        Auth[Auth Module]
        Robot[Robot Module]
        Users[Users Module]
        Audit[Audit Module]
        Middleware[JWT and Role Middleware]
    end

    subgraph Database[MongoDB Atlas]
        UserCollection[(Users)]
        AuditCollection[(Audit Logs)]
    end

    subgraph RobotSimulator[Virtual Robot Simulator - Docker]
        RobotREST[REST API<br/>status, move, reset, map, sensor]
        RobotWS[WebSocket<br/>telemetry]
    end

    Operator --> Pages
    Pages --> Components
    Pages --> Services
    Pages --> Hooks
    Services --> AuthStorage

    Services -->|HTTP requests| App
    Hooks -->|WebSocket| RobotWS

    App --> Auth
    App --> Robot
    App --> Users
    App --> Audit
    App --> Middleware

    Auth --> UserCollection
    Users --> UserCollection
    Audit --> AuditCollection

    Robot -->|HTTP requests| RobotREST
    Robot --> Audit