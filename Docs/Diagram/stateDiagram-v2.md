stateDiagram-v2
[*] --> ReceiveRequest
ReceiveRequest --> CheckRole
state check_role <<choice>>
CheckRole --> check_role
check_role --> RejectCommand : Role is Viewer
check_role --> SendToRobot : Role is Commander
RejectCommand --> [*]
SendToRobot --> [*]