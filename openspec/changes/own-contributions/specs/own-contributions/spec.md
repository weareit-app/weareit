# Spec Delta

## Purpose

Lets a person add their own pain, future or way on the personal and societal pages, use it straight away on their device, and, after signup, choose to send it to the founder for review.

## ADDED Requirements

### Requirement: Add a pain
At the end of each group on the personal and societal pages, an "Add a pain" control SHALL open a short form in place asking for a name and a first-person line. Saving SHALL add the pain to that group, selected and open, marked "Only you can see this".

#### Scenario: Add a pain to a group
- **WHEN** the person adds "Night shifts" with "I never see daylight." at the end of the Time group
- **THEN** it appears in that group, selected and open, marked "Only you can see this"

### Requirement: Add a future
Under an open pain's futures, an "Add a future" control SHALL open a form asking for a name, a first-person line and the future's position among that pain's futures, with a live preview of the joined sentence. Saving SHALL add the future at that position, picked.

#### Scenario: Future placed and picked
- **WHEN** the person adds a future under "Poor sleep" and places it after "I sleep through the night."
- **THEN** it appears in that position, picked, and the closed pain's sentence includes its line in that position

#### Scenario: Live preview
- **WHEN** the person moves the new future to a different position in the form
- **THEN** the preview shows the joined sentence with the new line in that position

### Requirement: Add a way
Under an open pain's ways, an "Add a way" control SHALL open a form asking for a name, a line, its type, and which of the futures picked under that pain it serves. Saving SHALL add the way under that pain, picked, and list it in the closed pain's summary like a published way of that type.

#### Scenario: Way in the summary
- **WHEN** the person adds a Habit way and closes the pain
- **THEN** the summary lists it under "I could:" with the Habit icon

### Requirement: Future line rule
A future's line SHALL be one first-person sentence ending in a period, so that any set of chosen futures joins with commas and "and". A line that breaks the rule SHALL NOT be saved; the form SHALL explain how to write it.

#### Scenario: Two sentences
- **WHEN** the person enters "I sleep. I wake up happy." as a future's line
- **THEN** the form explains that the line must be one sentence ending in a period, and nothing is saved

#### Scenario: Missing period
- **WHEN** the person enters "I wake up ready" without a period
- **THEN** the form explains the rule and nothing is saved

### Requirement: Own items work like published ones
An own pain, future or way SHALL behave like published content on the person's page: it can be picked and unpicked, it appears in collapsed previews and closed-pain summaries, and it persists across reloads. The person SHALL be able to edit or remove it.

#### Scenario: Remove an own future
- **WHEN** the person removes a future they added
- **THEN** it disappears from the pain and from every joined sentence

### Requirement: Contribution states
Each own item SHALL show its state in words: "Only you can see this" until sent, "In review" once sent, "Added" once published, and "Not added" if declined. A declined item SHALL stay on the person's page, still visible only to them.

#### Scenario: Declined
- **WHEN** the founder declines a sent future
- **THEN** the contributor still sees it on their page, marked "Not added", and nobody else sees it

### Requirement: Send for review
After signup, each own item that has not been sent SHALL offer "Send for review". Only choosing it SHALL send that item. Writing, editing, picking or signing up SHALL NOT send any own item.

#### Scenario: Signed in, not sent
- **WHEN** a signed-in person adds a way and does not choose "Send for review"
- **THEN** nothing about that way is sent

#### Scenario: Sent
- **WHEN** a signed-in person chooses "Send for review" on a future
- **THEN** it is sent with its pain and position, and its mark changes to "In review"

#### Scenario: Before signup
- **WHEN** a signed-out person views an own item
- **THEN** no "Send for review" control is shown

### Requirement: Own contributions privacy
Before signup, own items' text, place and position SHALL stay on the device and SHALL NOT be sent or counted in any form, including measurement. After signup, an item SHALL reach the server only when sent for review, stored with its contributor as private provenance. No own item SHALL be visible to anyone else unless the founder publishes it.

#### Scenario: Inspect requests before signup
- **WHEN** a signed-out person adds a pain, a future and a way and then uses the pages
- **THEN** no request contains their text, their placement, or any count of them

#### Scenario: Another visitor
- **WHEN** another person opens the same pain while a contribution is in review
- **THEN** they do not see it

### Requirement: Own contributions honest status
An own item SHALL never look like published or founder-approved content: the "Only you can see this", "In review" or "Not added" mark SHALL be shown wherever it appears on the page. An own way SHALL show its type tag like any way, and SHALL NOT imply that It has built or reviewed it.

#### Scenario: Own way in the list
- **WHEN** the person's own way appears in "Ways it can be better"
- **THEN** it shows its type tag and the "Only you can see this" mark

### Requirement: Own contributions accessibility
The add and edit forms SHALL be fully usable by keyboard with visible focus; every field SHALL have a label; rule errors SHALL be announced and not shown by colour alone; choosing a future's position SHALL work without dragging; the live preview SHALL be announced politely; state marks SHALL be text, read by screen readers with the item's name.

#### Scenario: Position by keyboard
- **WHEN** a keyboard user places a new future
- **THEN** they can move it up and down with buttons or keys and hear the updated preview

#### Scenario: State read aloud
- **WHEN** a screen reader focuses an own future that is in review
- **THEN** it announces the future's name, whether it is picked, and "In review"
