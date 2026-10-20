# Spec Delta

## MODIFIED Requirements

### Requirement: Ways it can be better
Once a dream is picked, the open pain SHALL show a "Ways it can be better" section listing the fixes linked to the picked dreams. Each fix SHALL show its title, a line of description, and a type tag: Task, Habit, Takes a group, or Feature. Features SHALL also show a roadmap status tag (Live, In progress, Planned, Exploring or Idea), matching `/roadmap`. Tapping a tag SHALL explain it; for every status except Live, the Feature explanation SHALL say it isn't available yet and that choosing it tells It to build it. For Live, it SHALL say the feature is available in It. Each fix SHALL be pickable and unpickable with one tap.

#### Scenario: Feature honesty
- **WHEN** the person taps the tag of a Feature fix that is not Live
- **THEN** the explanation says "Something It would offer. It isn't available yet; choosing it tells us to build it."

#### Scenario: Live feature
- **WHEN** the person taps the tag of a Live Feature fix
- **THEN** the explanation says "Available to use.", and nothing says it still needs building

#### Scenario: Status words
- **WHEN** a Feature fix is In progress
- **THEN** its status tag reads "In progress" in words, not only as a colour or icon
