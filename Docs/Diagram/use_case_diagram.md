flowchart LR
    Viewer[Viewer]
    Commander[Commander]

    subgraph GCS[Ground Control Station System]
        UC1((Sign Up))
        UC2((Sign In))
        UC3((Sign Out))
        UC4((View Dashboard))
        UC5((View Robot Status))
        UC6((View Robot Map))
        UC7((View LiDAR Summary))
        UC8((View Audit Logs))
        UC9((Move Robot))
        UC10((Reset Robot))
        UC11((Manage Users))
        UC12((Update User Role))
        UC13((Receive Telemetry Updates))
        UC14((View Connection Status))
    end

    Viewer --> UC1
    Viewer --> UC2
    Viewer --> UC3
    Viewer --> UC4
    Viewer --> UC5
    Viewer --> UC6
    Viewer --> UC7
    Viewer --> UC8
    Viewer --> UC13
    Viewer --> UC14

    Commander --> UC1
    Commander --> UC2
    Commander --> UC3
    Commander --> UC4
    Commander --> UC5
    Commander --> UC6
    Commander --> UC7
    Commander --> UC8
    Commander --> UC9
    Commander --> UC10
    Commander --> UC11
    Commander --> UC12
    Commander --> UC13
    Commander --> UC14

    UC9 -. creates .-> UC8
    UC10 -. creates .-> UC8
    UC12 -. creates .-> UC8