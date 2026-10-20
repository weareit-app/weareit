# Spec Delta

## Purpose

A public `/licensing` page that says plainly what of It is open today, under which license, what is only planned, and whose outside work It uses.

## ADDED Requirements

### Requirement: Licensing page
It SHALL have a `/licensing` page, reachable without an account and linked from the footer's bottom line, using the essay layout with a "last updated" date and change list.

#### Scenario: Signed out
- **WHEN** a signed-out person selects Licensing in the footer
- **THEN** the licensing page loads without asking them to sign in

### Requirement: Licenses by kind of material
The page SHALL list each kind of material with its license, matching `docs/architecture/licensing.md`: app and server code, SDKs and public protocol, knowledge data, guides and essays, and illustrations, each with a link to the license text.

#### Scenario: Essays
- **WHEN** someone looks up the essays' license
- **THEN** the page says CC BY-SA 4.0 and links to it

### Requirement: Today versus planned
The page SHALL separate what is true today from what is planned. If the code is not yet published, it SHALL say so. Ownership or governance by the people who use It SHALL be described only as an intention.

#### Scenario: Public repository
- **WHEN** the repository is public at release
- **THEN** the page links to it, next to the AGPL row

#### Scenario: Code not yet public
- **WHEN** the repository is private at release
- **THEN** the page says the code is not published yet and gives no repository link

### Requirement: Credits
The page SHALL credit outside work It uses: ESCO (CC BY 4.0, with a note that It edits labels), ISCED and the fonts, each with its license and a link.

#### Scenario: ESCO
- **WHEN** someone reads the credits
- **THEN** ESCO is named with its license, a link and a note that labels were changed

### Requirement: Licensing privacy
The page SHALL send only the `licensing` page view after its privacy note is shown, and SHALL load nothing from third parties.

#### Scenario: Viewing
- **WHEN** a signed-out person reads `/licensing`
- **THEN** only a `licensing` page view is sent, after the privacy note is on screen

### Requirement: Licensing honest status
The page SHALL NOT state that a license applies to material that has not been released under it.

#### Scenario: SDKs
- **WHEN** no SDK has been released
- **THEN** the Apache-2.0 row says it is the planned license for SDKs

### Requirement: Licensing accessibility
The license list SHALL be a table or list with headers that a screen reader announces, links SHALL say what they open, and headings SHALL be in order.

#### Scenario: Screen reader
- **WHEN** a screen-reader user reaches the license list
- **THEN** each row is read with its material and license
