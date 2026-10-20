# Spec Delta

## Purpose

A public `/roadmap` page showing what It has built, is building and is considering, kept in the database so it stays current, with honest statuses and dates.

## ADDED Requirements

### Requirement: Roadmap page
It SHALL have a `/roadmap` page, reachable without an account, using the essay layout: a short founder-approved introduction, then the roadmap items, a "last updated" date and a change list.

#### Scenario: Signed out
- **WHEN** a signed-out person opens `/roadmap`
- **THEN** it shows the introduction and the published roadmap items

### Requirement: Roadmap items and Feature fixes
The roadmap SHALL list every published roadmap item and every published Feature fix not connected to an item. A roadmap item is a piece of It's work (for example "Use It in Spanish"); it MAY be connected to one or more Feature fixes.

#### Scenario: Unconnected Feature fix
- **WHEN** a Feature fix is published and no roadmap item is connected to it
- **THEN** it appears on `/roadmap` as its own entry, without being entered twice

#### Scenario: Item without fixes
- **WHEN** "Use It in Spanish" is connected to no fix
- **THEN** it appears on `/roadmap` with no pain links

### Requirement: Connected fixes
A Feature fix connected to a roadmap item SHALL be shown inside that item, with links to its pains, and not listed again on its own. Its status SHALL be the item's status, so the roadmap and the explorer never disagree. A Feature fix SHALL be connected to at most one item.

#### Scenario: Status follows the item
- **WHEN** the founder moves an item connected to two Feature fixes from Planned to In Progress
- **THEN** both fixes show In Progress on `/roadmap` and in the explorer

#### Scenario: Connected fix not repeated
- **WHEN** a Feature fix is connected to an item
- **THEN** `/roadmap` shows it only under that item

### Requirement: Five statuses
Every roadmap item and Feature fix SHALL have exactly one status: Shipped, In Progress, Planned, Exploring or Idea. The roadmap SHALL group items by status in that order.

#### Scenario: Grouping
- **WHEN** the roadmap has one Shipped and two Idea items
- **THEN** the Shipped item is listed first under Shipped, and the two under Idea after any other groups

### Requirement: Item contents
Each entry SHALL show its title, a one-line description, its status, the date its status last changed and a short note of what changed. A Feature fix, whether its own entry or inside an item, SHALL also link to the pains it is a fix for.

#### Scenario: Feature fix entry
- **WHEN** an unconnected Planned Feature fix belongs to two pains
- **THEN** its roadmap entry shows Planned, the status date, the change note and links to both pain pages

### Requirement: Edited in the CMS
The founder SHALL create, edit, reorder and remove roadmap items, connect and disconnect Feature fixes, and change any status, in the CMS. Changing a status SHALL require a change note and record the date. Roadmap changes SHALL be published and rolled back with the rest of the content.

#### Scenario: Status change
- **WHEN** the founder moves an item from Planned to In Progress without a note
- **THEN** the CMS refuses until a note is entered

### Requirement: Stable item IDs
Each roadmap item SHALL have a readable stable ID that does not change when its title does.

#### Scenario: Rename
- **WHEN** the founder renames "Spanish" to "Use It in Spanish"
- **THEN** the item keeps its ID

### Requirement: Roadmap privacy
The roadmap SHALL show no counts of interest, picks or selected fixes in this release, and nothing about any person. Viewing it SHALL send only the `roadmap` page view after the page's privacy note is shown.

#### Scenario: Popular feature
- **WHEN** many people have selected a Feature fix
- **THEN** the roadmap shows no number or ranking based on that

### Requirement: Roadmap honest status
Only work that is live SHALL be Shipped; only work actually being built SHALL be In Progress. Planned SHALL mean decided but not started; Exploring, being looked into; Idea, not decided. No item SHALL carry a promised date. Each status SHALL be explained in words on the page.

#### Scenario: Status explanation
- **WHEN** someone reads the Exploring group
- **THEN** a line says these are being looked into and may not be built

### Requirement: Roadmap accessibility
Status groups SHALL be headings, each item's status SHALL be written in words (never colour or icon alone), and the page SHALL be readable by keyboard and screen reader in status order.

#### Scenario: Screen reader
- **WHEN** a screen-reader user moves through `/roadmap`
- **THEN** they hear each status heading followed by its items with their status, date and note
