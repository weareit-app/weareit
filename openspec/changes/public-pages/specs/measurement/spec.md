# Spec Delta

## ADDED Requirements

### Requirement: Public page views
The page-view list SHALL also include `why`, `roadmap`, `principles`, `ai`, `risks` and `licensing`, one for each public page. Each SHALL be sent, like other page views, only in a release where that page is published, and only after the page's privacy note has been shown.

#### Scenario: Reading the roadmap
- **WHEN** a visit shows `/roadmap`
- **THEN** a `roadmap` page view is recorded, with no item, status or link the person followed

#### Scenario: Unpublished essay
- **WHEN** `/risks` is not published in a release
- **THEN** no `risks` page view is ever sent in that release
