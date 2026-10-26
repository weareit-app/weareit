# api-errors Specification

## Purpose
Defines how failures cross the API, from the domain and repositories through the router to the words people read, and how the server logs what nobody expected, so callers can act on known failures and people never see a developer's message.

## Requirements

### Requirement: Declared errors per operation
Each API operation SHALL declare the failures its caller acts on, each with a code and an HTTP status, and with a validated data shape where the app needs details. A failure the caller does not act on SHALL NOT be declared.

#### Scenario: Rollback with issues
- **WHEN** a rollback is refused because the target version has publish issues
- **THEN** the caller receives the declared rollback error with the issues as structured data, not inside the message

### Requirement: Domain-named codes
A signed-out call SHALL keep failing with `UNAUTHORIZED`, and a lookup of a record the caller does not own SHALL keep failing with `NOT_FOUND`. Every code added from now on SHALL be named for what happened in the domain, such as `REVISION_CONFLICT`, `CONTENT_NOT_PUBLISHED`, and `PAYMENTS_NOT_CONFIGURED`. A failure several operations share SHALL be declared once, on a base those operations build from.

#### Scenario: Shared sign-in failure
- **WHEN** a contributor adds a signed-in-only operation
- **THEN** it inherits the declared `UNAUTHORIZED` error from its base instead of declaring its own

#### Scenario: New failure
- **WHEN** a contributor declares a failure no existing code covers
- **THEN** its code names the domain event, such as `REVISION_CONFLICT`, not a generic HTTP name

### Requirement: Draft revision conflict
Saving a CMS draft whose revision has changed since the editor loaded it SHALL fail with `REVISION_CONFLICT`. The editor SHALL tell the founder the draft changed elsewhere and how to get the latest version, and SHALL NOT show "Internal server error".

#### Scenario: Two tabs
- **WHEN** the founder saves a draft in one tab after saving it in another
- **THEN** the second save fails with `REVISION_CONFLICT` and the editor shows its conflict message

### Requirement: Server failures are typed
Repositories and services SHALL signal an expected failure by throwing an error class, defined in the package that throws it, carrying its details as data. They SHALL NOT signal failures by message strings. The router SHALL map each class to a declared contract error.

#### Scenario: Payments not configured
- **WHEN** a support operation runs and payments are not configured
- **THEN** the payment service throws its not-configured error class and the router returns `PAYMENTS_NOT_CONFIGURED`

### Requirement: Undeclared errors stay hidden
An error that is not declared SHALL reach the client as an internal server error with a generic message. Its message and cause SHALL NOT be sent to the client.

#### Scenario: Unexpected database failure
- **WHEN** a query fails with a driver error
- **THEN** the client receives an internal server error with no driver detail

### Requirement: Domain logic returns outcomes
Pure domain logic SHALL return expected outcomes as plain values, such as a list of issues or a parse result, and SHALL throw only when an invariant is broken.

#### Scenario: Unpublishable graph
- **WHEN** a content graph fails publish validation
- **THEN** validation returns its issues and throws nothing

### Requirement: The app writes error copy
The words people see for an API failure SHALL be written in the app, keyed by error code, following the copy style guide. A screen SHALL map each declared code it handles to its copy and SHALL show one generic sentence for any other failure. The server's message SHALL be for developers and logs only.

#### Scenario: Unknown failure on Support It
- **WHEN** a support call fails with an undeclared error
- **THEN** the page shows the generic sentence, not the server's message

### Requirement: Honest error messages
An error message SHALL say what did not happen and SHALL NOT imply that a save, payment, or publish succeeded when it failed. A message SHALL NOT promise a fix It has not built.

#### Scenario: Payment not started
- **WHEN** starting a support payment fails because payments are not configured
- **THEN** the page says support is not available right now and does not show a pending or confirmed state

### Requirement: Accessible error messages
An error message SHALL be shown as text near the action that failed, SHALL be announced to screen readers when it appears, and SHALL NOT rely on color alone. Focus SHALL stay where the person can retry by keyboard.

#### Scenario: Screen reader on a failed save
- **WHEN** a CMS save fails while a screen reader is running
- **THEN** the conflict message is announced and the save control can still be reached by keyboard

### Requirement: Server logging
The API server and the database scripts SHALL write logs through one It-owned logging package with levels (debug, info, warn, error), as one structured line per event on the console. The tools print output for a person and SHALL keep using the console (founder, 2026-10-23).

#### Scenario: Tool output
- **WHEN** a tool in `tools/` reports its result
- **THEN** it prints to the console for the person running it, without the logging package

### Requirement: Undeclared failures logged by cause
The API server SHALL log a failure it didn't expect (a server error, including an undeclared error sent as an internal server error) at error level with its operation and cause. It SHALL log an undeclared failure caused by a bad request, such as input that fails validation, at warn level with its operation but not its cause, because the cause holds the input (founder, 2026-10-23).

#### Scenario: Undeclared error logged
- **WHEN** an operation fails with an undeclared error that becomes an internal server error
- **THEN** one error-level line is written with the operation name and the cause

#### Scenario: Bad request logged
- **WHEN** an operation rejects input that fails validation
- **THEN** one warn-level line is written with the operation name, and the input is not in it

### Requirement: Log privacy
Logs SHALL NOT contain secrets, passwords, sign-in codes, session tokens, payment details, or a person's onboarding answers, contributions, or free text. Logs SHALL identify an account only by its ID, and only after signup. The one exception is local development, which may log sign-in codes when no email server is configured.

#### Scenario: Failed sign-in code
- **WHEN** an email code check fails in production
- **THEN** the log line records the failure without the code or the email address
