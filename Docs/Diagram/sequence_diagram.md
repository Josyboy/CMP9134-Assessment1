sequenceDiagram
    actor Commander
    participant Frontend as React Frontend
    participant Auth as Auth Storage
    participant Backend as Express Backend
    participant Middleware as JWT / Role Middleware
    participant RobotAPI as Robot Simulator API
    participant Audit as Audit Service
    participant DB as MongoDB
    participant WS as WebSocket Telemetry

    Commander->>Frontend: Enter X and Y coordinates
    Commander->>Frontend: Click Move Robot

    Frontend->>Auth: Get stored JWT
    Auth-->>Frontend: Return JWT

    Frontend->>Backend: POST /api/robot/move
    Backend->>Middleware: Verify token and role

    alt User is not Commander
        Middleware-->>Backend: Reject request
        Backend-->>Frontend: 403 Forbidden
        Frontend-->>Commander: Show permission error
    else User is Commander
        Middleware-->>Backend: Allow request
        Backend->>RobotAPI: GET /api/status
        RobotAPI-->>Backend: Return status before move

        Backend->>RobotAPI: POST /api/move
        RobotAPI-->>Backend: Return move result

        Backend->>RobotAPI: GET /api/status
        RobotAPI-->>Backend: Return updated status

        Backend->>Audit: Create MOVE audit log
        Audit->>DB: Save audit entry
        DB-->>Audit: Confirm saved

        Backend-->>Frontend: Return success response
        RobotAPI-->>WS: Publish telemetry update
        WS-->>Frontend: Updated robot position/status
        Frontend-->>Commander: Update dashboard
    end