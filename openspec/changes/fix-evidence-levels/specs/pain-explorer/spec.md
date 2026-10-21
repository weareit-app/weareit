# Spec Delta

## ADDED Requirements

### Requirement: Evidence not shown in v0.1
The personal and societal pages SHALL NOT show any way's evidence level, method evidence, link evidence or note, and SHALL NOT use wording, icons, colour or ordering that implies one. Ways SHALL keep showing only their type tag and, for features, their roadmap status, so a Feature never looks tested, and never looks available unless its status is Shipped.

#### Scenario: Strong evidence
- **WHEN** a way with "Strong" evidence is listed under "Ways it can be better"
- **THEN** it looks exactly like a way with "Not tested yet", apart from its own title, description and type

#### Scenario: Feature honesty kept
- **WHEN** a person views a Feature way
- **THEN** it shows its Feature tag and its status (Shipped, In Progress, Planned, Exploring or Idea), and nothing suggests it has been tested
- **AND** only a Shipped Feature says it is available in It; every other status says it isn't available yet
