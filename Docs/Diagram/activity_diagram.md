flowchart TD
    A([Start]) --> B[User opens GCS app]
    B --> C{Authenticated?}

    C -- No --> D[Show Login / Signup page]
    D --> E[User submits credentials]
    E --> F[Backend validates user]
    F --> G{Valid credentials?}

    G -- No --> H[Show authentication error]
    H --> D

    G -- Yes --> I[Store JWT and user details]
    I --> J[Redirect to Dashboard]

    C -- Yes --> J

    J --> K[Fetch robot status]
    K --> L[Fetch robot map]
    L --> M[Connect to WebSocket telemetry]
    M --> N[Display dashboard]

    N --> O{User action}

    O -- Move robot --> P{User is Commander?}
    P -- No --> Q[Show permission error]
    Q --> N

    P -- Yes --> R[Send move command]
    R --> S[Backend sends command to Robot API]
    S --> T[Save audit log]
    T --> U[Update dashboard status and position]
    U --> N

    O -- Reset robot --> V{User is Commander?}
    V -- No --> W[Show permission error]
    W --> N

    V -- Yes --> X[Send reset command]
    X --> Y[Backend sends reset to Robot API]
    Y --> Z[Save audit log]
    Z --> AA[Refresh dashboard]
    AA --> N

    O -- View LiDAR Summary --> AB[Fetch sensor data]
    AB --> AC[Display sensor and LiDAR summary]
    AC --> N

    O -- View Audit Logs --> AD[Fetch paginated audit logs]
    AD --> AE[Display logs table]
    AE --> N

    O -- Manage Users --> AF[Fetch users]
    AF --> AG[Update user role]
    AG --> AH[Save role update audit log]
    AH --> N

    O -- Sign out --> AI[Clear local auth data]
    AI --> D