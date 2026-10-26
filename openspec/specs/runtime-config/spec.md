# runtime-config Specification

## Purpose
Defines how each program that reads environment variables validates them, when it does so, how public app variables stay apart from server secrets, and how example files stay in step with the schemas.

## Requirements

### Requirement: One schema per program
Each program that reads environment variables SHALL own one schema for them: the API server, the app, and the database scripts. No schema SHALL be shared between programs, and none SHALL live in `@it/domain`.

#### Scenario: New server variable
- **WHEN** a contributor adds a variable the API server reads
- **THEN** they add it to the API server's schema and nowhere else

### Requirement: Parsed once at the entry point
The API server and each database script SHALL parse their environment once, at their entry point, and SHALL refuse to start when it is invalid, listing every problem at once. Other modules SHALL receive typed config as arguments.

#### Scenario: Two problems at once
- **WHEN** the API server starts with `NODE_ENV` missing and a malformed `DATABASE_URL`
- **THEN** it exits before listening and reports both variables

### Requirement: Only the env files read the environment
Only each program's env file and one shared test env file (for `TEST_DATABASE_URL`) SHALL read `process.env`, and lint SHALL fail anywhere else. Tests and the local payment mock SHALL build config objects and pass them in, never changing `process.env`.

#### Scenario: Module reads the environment
- **WHEN** a payment service file reads `process.env.STRIPE_SECRET_KEY`
- **THEN** lint fails

### Requirement: Server environment rules
`NODE_ENV` SHALL be required, with no default, and SHALL be `development`, `test`, or `production`. Stripe, SMTP, and RevenueCat SHALL each be all-or-none groups, all required when `NODE_ENV` is `production`. Without a group outside production, the server SHALL keep its local mock or console fallback. An empty string SHALL count as unset.

#### Scenario: Production without SMTP
- **WHEN** the API server starts with `NODE_ENV=production` and no SMTP settings
- **THEN** it refuses to start and names the SMTP group

#### Scenario: Half a group
- **WHEN** only `STRIPE_SECRET_KEY` is set, without the rest of the Stripe group
- **THEN** startup fails and names the missing Stripe variables

### Requirement: Public app variables
The app SHALL read each public `EXPO_PUBLIC_*` variable by name in one file, which parses them with the app's schema and is the only app file that reads them. Expo's app config SHALL parse the same schema, so every Expo command fails on a bad value. The app SHALL have no hard-coded fallback address.

#### Scenario: Bad API address at export
- **WHEN** `expo export` runs with `EXPO_PUBLIC_API_URL` set to something that is not a URL
- **THEN** the export fails and names the variable

### Requirement: Server and public variables kept apart
The API server SHALL NOT read any `EXPO_PUBLIC_*` variable. Shared packages SHALL take what they need, such as the API address, as arguments and SHALL NOT read the environment. Server and database variables SHALL be listed in the root example file; public app variables SHALL be listed in the app's example file.

#### Scenario: RevenueCat key for iOS
- **WHEN** a contributor sets up the iOS app
- **THEN** `EXPO_PUBLIC_REVENUECAT_IOS_API_KEY` is listed in `apps/app/.env.example`, where Expo loads it

### Requirement: Examples stay in step
A unit test SHALL fail when an example file's keys differ from its schema's keys, or when the example does not parse. Once `render.yaml` exists, the same test SHALL compare its environment keys with the server schema.

#### Scenario: Variable added to the schema only
- **WHEN** a contributor adds a variable to the server schema but not to `.env.example`
- **THEN** the unit tests fail and name the variable

### Requirement: Config errors keep values private
A configuration error SHALL name the variable and the rule it broke and SHALL NOT print the value, so secrets stay out of host and CI logs. No public `EXPO_PUBLIC_*` variable SHALL hold a secret, because public values are plain text in the app bundle.

#### Scenario: Malformed secret
- **WHEN** `STRIPE_SECRET_KEY` has the wrong prefix
- **THEN** the error names `STRIPE_SECRET_KEY` and its rule, without the key
