# Spec Delta

## MODIFIED Requirements

### Requirement: Ways it can be better
Once a dream is picked, the open pain SHALL show a "Ways it can be better" section listing the fixes linked to the picked dreams. Each fix SHALL show its title, a line of description, and a type tag: Task, Habit, Takes a group, or Feature. Features SHALL also show a roadmap status tag (Shipped, In Progress, Planned, Exploring or Idea), matching `/roadmap`. Tapping a tag SHALL explain it; for every status except Shipped, the Feature explanation SHALL say it isn't available yet and that choosing it tells It to build it. For Shipped, it SHALL say the feature is available in It. Each fix SHALL be pickable and unpickable with one tap.

#### Scenario: Feature honesty
- **WHEN** the person taps the tag of a Feature fix that is not Shipped
- **THEN** the explanation says "Something It would offer. It isn't available yet; choosing it tells us to build it."

#### Scenario: Shipped feature
- **WHEN** the person taps the tag of a Shipped Feature fix
- **THEN** the explanation says it is available in It now, and nothing says it still needs building

#### Scenario: Status words
- **WHEN** a Feature fix is In Progress
- **THEN** its status tag reads "In Progress" in words, not only as a colour or icon
