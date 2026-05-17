classDiagram
    class User {
        +String _id
        +String forename
        +String email
        +String password
        +String role
        +Date createdAt
        +Date updatedAt
    }

    class AuditEntry {
        +String _id
        +ObjectId userId
        +String userEmail
        +String action
        +Object payload
        +Boolean success
        +String errorMessage
        +Date createdAt
    }

    class AuthController {
        +registerUser(req, res)
        +loginUser(req, res)
        +logoutUser(req, res)
    }

    class RobotController {
        +getRobotStatus(req, res)
        +moveRobot(req, res)
        +resetRobot(req, res)
        +getRobotMap(req, res)
        +getRobotSensor(req, res)
    }

    class UserController {
        +getUsers(req, res)
        +updateUserRole(req, res)
    }

    class AuditController {
        +getAuditEntries(req, res)
    }

    class AuthMiddleware {
        +verifyToken(req, res, next)
        +requireCommander(req, res, next)
    }

    class RobotService {
        -String robotApiBase
        +getStatus()
        +moveRobot(x, y)
        +resetRobot()
        +getMap()
        +getSensor()
        +handleRobotResponse()
    }

    class AuditService {
        +createAuditEntry(data)
    }

    class ApiService {
        +signup(body)
        +signin(body)
        +signout()
        +getRobotStatus()
        +moveRobot(body)
        +resetRobot()
        +getRobotMap()
        +getSensors()
        +getAuditEntries(page, limit)
        +getUsers()
        +updateUserRole(id, role)
    }

    class UseTelemetry {
        +connectWebSocket()
        +setTelemetry()
        +setConnected()
        +handleDisconnect()
    }

    AuthController --> User
    UserController --> User
    AuditController --> AuditEntry
    AuditService --> AuditEntry
    RobotController --> RobotService
    RobotController --> AuditService
    AuthMiddleware --> User
    ApiService --> AuthController
    ApiService --> RobotController
    ApiService --> UserController
    ApiService --> AuditController
    UseTelemetry --> RobotService
    AuditEntry --> User