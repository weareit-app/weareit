# Spec Delta

## Purpose

The footer on large screens and the menu on small screens: one shared list of links to It's public pages and account screens, so every page can reach them.

## ADDED Requirements

### Requirement: Footer on large screens
On large screens every page SHALL end with a footer of four groups, in this order: About It (Why, Principles, Roadmap, Risks), Research & building (AI, then Research and Technology once published), The possibilities (Possibility and Future once published) and Take part (Support, Help, Contact).

#### Scenario: Large screen
- **WHEN** a person on a large screen scrolls to the end of the personal page
- **THEN** they see the footer groups, with About It first and Take part last

### Requirement: Footer bottom line
Below the groups, the footer SHALL show one line with Privacy, FAQ, Licensing and the contact address `hello@weareit.app` as an email link.

#### Scenario: Contact
- **WHEN** a person selects the contact address in the footer
- **THEN** their email app opens a new message to `hello@weareit.app`

### Requirement: Menu on small screens for everyone
On small screens the footer SHALL NOT show; a menu button SHALL be on every page, signed in or not, and the menu SHALL hold the same groups and bottom line. Signed out it SHALL also offer "Sign in"; signed in it SHALL also offer Account. On large screens a signed-in person SHALL also have the menu.

#### Scenario: Signed-out phone
- **WHEN** a signed-out person on a phone opens the menu on the societal page
- **THEN** it lists the published essays, Privacy, FAQ, Licensing, the contact address and "Sign in"

#### Scenario: Signed-in phone
- **WHEN** a signed-in person on a phone opens the menu
- **THEN** it also lists Account, Support and Help, and no "Sign in"

### Requirement: Only published pages linked
A link SHALL appear in the footer and menu only when its page is published in that release. A group with no published links SHALL be hidden. No link SHALL say "coming soon" or lead to a placeholder.

#### Scenario: First release
- **WHEN** only `/why` and `/ai` are published
- **THEN** About It shows only Why, Research & building shows only AI, and The possibilities is not shown

### Requirement: Account links only when signed in
Support and Help SHALL appear in Take part only when the person is signed in and that page exists in the release. Contact SHALL always appear.

#### Scenario: Signed out
- **WHEN** a signed-out person views the footer
- **THEN** Take part shows Contact and nothing else

### Requirement: One link list
The footer and the menu SHALL be built from one list of links and groups, so a page added to the list appears in both, and other changes SHALL add their links to that list.

#### Scenario: New page
- **WHEN** a page is added to the list and published
- **THEN** it appears in the footer on large screens and in the menu on small screens, in the same group

### Requirement: Web pages from the iOS app
In the iOS app, a footer or menu link to a page built for the web only SHALL open that page's web address in an in-app browser that the person can close to return to where they were.

#### Scenario: Why on iOS
- **WHEN** a person in the iOS app chooses Why in the menu
- **THEN** `/why` opens in an in-app browser, and closing it returns them to the same screen with their picks unchanged

### Requirement: Navigation privacy
Opening the footer or menu and following its links SHALL NOT send anything by itself and SHALL NOT change or send on-device picks. Links SHALL carry no personal data or identifier. Page views of the pages they open are counted only as the measurement capability lists.

#### Scenario: Follow a link before signup
- **WHEN** a signed-out person with picks follows Principles in the footer
- **THEN** the address is `/principles` with no query or identifier, and their picks stay on the device

### Requirement: Navigation honest status
Footer and menu labels SHALL name only pages that exist and SHALL NOT describe a planned page or feature as available.

#### Scenario: Unpublished essay
- **WHEN** `/future` is not published
- **THEN** no footer or menu label mentions it

### Requirement: Navigation accessibility
The footer SHALL be a labelled navigation landmark with each group as a labelled list. The menu button SHALL announce whether the menu is open or closed, the menu SHALL be fully keyboard operable with focus moved in on open and returned on close, Escape SHALL close it, and opening it SHALL respect reduced motion.

#### Scenario: Keyboard
- **WHEN** a keyboard user opens the menu, tabs through it and presses Escape
- **THEN** every link is reached in order, the menu closes and focus returns to the menu button, which is announced as collapsed
