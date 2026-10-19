# Spec Delta

## Purpose

The post-signup page where people say what they know (background and skills) and offer to help with specific asks, plus managing that from their account and the founder's view of offers.

## ADDED Requirements

### Requirement: Place in the flow
The Help build It page SHALL come after the Support page (whether the person supported or skipped) and before "You're all set". It SHALL be skippable, SHALL only be shown to signed-in people, and SHALL be reachable later from the signed-in menu.

#### Scenario: After Support
- **WHEN** a newly signed-up person finishes or skips Support
- **THEN** they see the Help build It page

#### Scenario: Skip
- **WHEN** the person skips Help build It
- **THEN** they see "You're all set" and nothing about Help is saved

#### Scenario: Signed out
- **WHEN** a signed-out person opens the Help address
- **THEN** they are asked to sign in

### Requirement: Occupations background
The person SHALL be able to add jobs and volunteering they have done by choosing occupations from the ESCO list, marking each as work or volunteering, and remove them. Each SHALL be stored as an ESCO reference with its original URI, even where the shown label was edited.

#### Scenario: Add an occupation
- **WHEN** the person searches for "nurse" and chooses an occupation as volunteering
- **THEN** it is added to their background, stored with its ESCO URI

### Requirement: Education background
The person SHALL be able to add education as an ISCED 2011 level shown in plain words, with an optional broad field of study, and remove it.

#### Scenario: Add education
- **WHEN** the person chooses "Bachelor's degree" with the field "Engineering"
- **THEN** it is added to their background with its ISCED level and field codes

### Requirement: Optional note
The person SHALL be able to add an optional note about other experience, up to 500 characters. The note SHALL be visible only to the founder and SHALL never be public.

#### Scenario: Too long
- **WHEN** the person types more than 500 characters
- **THEN** the note is limited to 500 and the page says so

### Requirement: Suggested skills
From the occupations in the background, the page SHALL suggest their ESCO essential skills, with no cap, grouped under the background entry that suggested them. Each group SHALL show its first 8 skills with "Show all". A skill suggested by more than one entry SHALL appear once.

#### Scenario: Two occupations sharing a skill
- **WHEN** two background entries both suggest "teamwork"
- **THEN** "teamwork" appears once

### Requirement: Confirming skills
The person SHALL be able to keep all of a group's skills at once and remove skills one by one. Only kept skills SHALL be saved, as ESCO references with original URIs.

#### Scenario: Keep a group
- **WHEN** the person taps "Keep all" on a group and removes one skill
- **THEN** every other skill in that group is saved

### Requirement: Matched and other asks
The page SHALL list open asks. Asks whose needed skills overlap the person's kept skills SHALL appear first under "These fit what you know", and every other open ask SHALL appear under "Other ways to help". No ask SHALL be hidden because it does not match.

#### Scenario: No matches
- **WHEN** none of the person's skills match any ask
- **THEN** all open asks appear under "Other ways to help"

### Requirement: Offering
The person SHALL be able to tick any number of open asks and submit. Before submitting, the page SHALL say plainly that It may contact them about what they offer, and after submitting SHALL say "We'll reach out if one of these needs you now. We can't reply to everyone."

#### Scenario: Submit offers
- **WHEN** the person ticks two asks and submits
- **THEN** two offers are saved on their account and the honest follow-up line is shown

### Requirement: Contact only about offers
It SHALL contact a person about an offer only by email to their account email, sent by the founder, and only about the asks they offered. Offering SHALL NOT subscribe them to update emails.

#### Scenario: No opt-in implied
- **WHEN** a person who did not tick the update opt-in submits an offer
- **THEN** they still receive no update emails

### Requirement: Managing background and offers
The account screen SHALL have "Your background" and "Your offers" sections where the person can edit background and kept skills, and change or withdraw offers. Offers on closed asks SHALL show "This ask has closed".

#### Scenario: Withdraw an offer
- **WHEN** the person withdraws an offer
- **THEN** it no longer appears to the founder and the ask's count drops

#### Scenario: Closed ask
- **WHEN** the founder closes an ask the person offered on
- **THEN** their offer shows "This ask has closed" and they cannot make a new offer on it

### Requirement: Founder view of offers
A founder-only page behind the admin token SHALL show, per ask, the number of offers and each offer with the person's name, email, background, kept skills and note, and SHALL let the founder mark an offer "followed up".

#### Scenario: Follow up
- **WHEN** the founder emails a person and marks their offer "followed up"
- **THEN** the mark and its date are saved and shown on the founder page

### Requirement: Help data on account deletion
When an account is deleted, its background, kept skills, note and offers SHALL be deleted, and counts per ask SHALL drop accordingly.

#### Scenario: Deleted account
- **WHEN** an account with two offers is deleted
- **THEN** its Help data is gone and each ask's count is one lower

### Requirement: Spanish labels
When Spanish is active, occupations and skills SHALL use ESCO's Spanish labels. A label the founder edited SHALL show in Spanish only once it has a reviewed Spanish edit; until then it SHALL show in English with the "English only for now" tag.

#### Scenario: Edited label without Spanish
- **WHEN** Spanish is active and an edited skill label has no Spanish edit
- **THEN** it shows in English with the tag

### Requirement: Attribution
The page SHALL show a notice crediting ESCO and saying its labels were modified, and SHALL credit ISCED, in wording that meets their licence terms.

#### Scenario: Notice present
- **WHEN** the Help build It page is shown
- **THEN** the ESCO and ISCED credits are visible on it

### Requirement: Help privacy
Help data SHALL exist only after signup, SHALL be visible only to the person and the founder, and SHALL never be public or shared with anyone else. Nothing about Help SHALL be collected before signup.

#### Scenario: Another account
- **WHEN** a different signed-in person uses the app
- **THEN** they cannot see anyone else's background, skills, note or offers

### Requirement: Help honest status
Asks SHALL be labelled honestly (what It needs, not what It has), and an offer SHALL never be shown as matched, accepted or in progress unless the founder has marked it so.

#### Scenario: After submitting
- **WHEN** a person views their offers
- **THEN** each shows only "Offered", "Followed up" or "This ask has closed"

### Requirement: Help accessibility
Pickers, skill groups ("Show all", "Keep all", remove) and ask checkboxes SHALL be keyboard reachable with visible focus, SHALL announce their state and group expansion to screen readers, and SHALL not rely on colour alone.

#### Scenario: Screen reader on a skill group
- **WHEN** a screen-reader user opens "Show all" on a group
- **THEN** the expansion and the number of skills are announced
