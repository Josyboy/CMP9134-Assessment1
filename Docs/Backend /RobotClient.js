// robotClient.js
// Singleton + Facade Pattern Implementation

class RobotClient {
    // Holds the one and only instance
    static instance = null;

    constructor() {
        // Prevent creating multiple instances
        if (RobotClient.instance) {
            return RobotClient.instance;
        }

        // Base API URL for the Virtual Robot (Docker)
        this.baseUrl = "http://localhost:5000"; // Change if needed

        RobotClient.instance = this; // Save instance
    }

    // -------------------------
    // Singleton Access Method
    // -------------------------
    static getInstance() {
        if (!RobotClient.instance) {
            RobotClient.instance = new RobotClient();
        }
        return RobotClient.instance;
    }

    // -------------------------
    // Facade Methods
    // -------------------------

    // Get robot status
    async getStatus() {
        try {
            const response = await fetch(`${this.baseUrl}/api/status`);
            return await response.json();
        } catch (error) {
            console.error("Error getting robot status:", error);
            throw error;
        }
    }

    // Send move command to robot
    async move(x, y) {
        try {
            const response = await fetch(`${this.baseUrl}/api/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ x, y })
            });
            return await response.json();
        } catch (error) {
            console.error("Error moving robot:", error);
            throw error;
        }
    }

    // Reset the robot
    async reset() {
        try {
            const response = await fetch(`${this.baseUrl}/api/reset`, {
                method: "POST"
            });
            return await response.json();
        } catch (error) {
            console.error("Error resetting robot:", error);
            throw error;
        }
    }
}

// ----------------------------
// Export the Singleton Instance
// ----------------------------
module.exports = RobotClient.getInstance();
