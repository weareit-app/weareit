# futures-and-ways-to-help Specification

## Purpose
After the societal page, two screens summarise a direction and invite people to say how they might help: a futures screen (`/onboarding/futures`) and an "exploratory waitlist" of ways to help (`/ways-to-help`), which leads to the save screen.

## Requirements

### Requirement: Futures screen
The futures screen SHALL show "A direction to move" and "Picture a life with more room in it.", explain that the futures come from what the person chose and "aren't promises or prescriptions", list the futures for their choices, and offer links to `/ways-to-help`, to Support It (`/support-it`), and "Go back and change choices" (`/onboarding/world`).

#### Scenario: Go back
- **WHEN** the person taps "Go back and change choices"
- **THEN** they return to the societal page with their choices intact

### Requirement: Ways to help
The ways-to-help screen SHALL show "An exploratory waitlist", "There is room for you in this.", and five help interests the person can pick: Invite one person, Check one claim or source, Try the onboarding and give feedback, Put a skill to use, Help wherever you are needed. Picks SHALL be kept in the on-device draft as help interests. The screen SHALL link onward to `/save-progress`, to Support It, and back to the futures screen ("Just exploring?").

#### Scenario: Pick an interest
- **WHEN** the person picks "Check one claim or source"
- **THEN** it is stored on the device as a help interest

## Known divergence from founder decisions (2026-10-19)
- The founder decided to retire the futures screen (dreams live inline; the signup gate follows the societal page directly) and the pre-signup ways-to-help screen (its items become first asks on a post-signup "Help build It" page).
- Both screens link to Support It before signup; the founder decided Support comes only after signup.
