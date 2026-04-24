classDiagram
class User {
-String username
-String passwordHash
-String role
+login() bool
+getRole() String
}
class RobotController {
-String apiEndpoint
+getStatus() JSON
+moveRobot(int x, int y) bool
}
User "1" --> "1" RobotController : Uses