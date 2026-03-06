flowchart LR
%% Define Actors
C[Commander]
V[Viewer]
%% Define Use Cases
Move((Move Robot))
Status((View Status))
%% Connect Actors to Use Cases
C --> Move
C --> Status
V --> Status