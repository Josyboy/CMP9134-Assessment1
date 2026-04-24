# System Architecture

## Architectural Pattern

The Ground Control Station is implemented using the **Model–View–Controller (MVC)** architectural pattern. This pattern separates the system into three major layers to improve maintainability, scalability, and code organization.

The **View layer** is responsible for rendering the user interface that allows operators to control the robot and monitor system status. In this system, the View is implemented using **HTML templates and Bootstrap**, which provide the dashboard interface for sending commands and displaying robot data.

The **Controller layer** is implemented using the **Node.js Express framework**. Controllers handle HTTP requests from the dashboard, process the application logic, and communicate with backend services such as the Robot API Client and the Mission Logger.

The **Model layer** manages system data and business logic. It includes components such as the Mission Logger and database interactions using **SQLite** or **MongoDB**. This layer stores mission commands, robot activity logs, and system data required for the application.

This architecture ensures that the user interface, business logic, and data management remain independent, making the system easier to maintain and extend.

graph TD

User --> Dashboard
Dashboard --> Controller
Controller --> RobotAPIClient
Controller --> MissionLogger
MissionLogger --> Database
RobotAPIClient --> VirtualRobot