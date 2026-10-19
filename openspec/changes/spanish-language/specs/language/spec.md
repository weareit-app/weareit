# Spec Delta

## Purpose

Decides which language a person sees It in (English or Spanish), how that choice is made and kept, how text in a language that is not available falls back, and how language is declared to browsers and screen readers.

## ADDED Requirements

### Requirement: Supported languages
It SHALL offer English and Spanish. English SHALL be the default and the fallback. The set of languages SHALL be a list, so that more languages, including right-to-left ones, can be added without changing how the choice works.

#### Scenario: Two languages offered
- **WHEN** a person opens the language control
- **THEN** it offers English and Spanish and nothing else

### Requirement: Language follows the device by default
Without an explicit choice, It SHALL use the first entry in the device or browser's preferred-language list that is English or Spanish, treating any regional Spanish (es-MX, es-US, es-419, es-ES) as Spanish. If neither appears, It SHALL use English. It SHALL NOT use location to choose.

#### Scenario: Spanish device
- **WHEN** a first-time visitor's browser lists es-MX first
- **THEN** It is shown in Spanish

#### Scenario: French then Spanish
- **WHEN** the browser lists French, then Spanish, then English
- **THEN** It is shown in Spanish

#### Scenario: Unrelated language
- **WHEN** the browser lists only Catalan and Portuguese
- **THEN** It is shown in English

#### Scenario: Device language changes
- **WHEN** a person who never chose a language changes their device to Spanish
- **THEN** It opens in Spanish next time

### Requirement: Language control on every screen
Every screen a person can reach, before and after signup, SHALL offer a language control that switches language in at most two taps or clicks. Each option SHALL be named in its own language: "English" and "Español".

#### Scenario: Switch from any screen
- **WHEN** a person on the signup gate opens the language control and chooses "Español"
- **THEN** the gate is shown in Spanish

### Requirement: Switching keeps everything in place
Switching language SHALL change text in place without reloading the page, and SHALL NOT change, clear or reorder picked dreams, selected fixes, which pains or groups are open, text typed into a field, or where the person is in the flow.

#### Scenario: Switch mid-way
- **WHEN** a person has a pain open with two dreams picked and an email half-typed elsewhere, and switches to Spanish
- **THEN** the same pain is open, the same dreams are picked, and the typed text is still there

### Requirement: Choice kept on the device before signup
Before signup, an explicit language choice SHALL be kept only on the device and SHALL persist across restarts and reloads on that device. It SHALL NOT be sent to It's servers except as the Privacy requirement allows.

#### Scenario: Reopen after choosing
- **WHEN** a signed-out person chose Spanish on an English browser and reopens It the next day
- **THEN** It opens in Spanish

### Requirement: Language kept on the account after signup
Once a person is signed in, the language they are using SHALL be saved to their account, and SHALL be used on every device where they are signed in, ahead of the device language.

#### Scenario: Sign in on an English laptop
- **WHEN** a person whose account language is Spanish signs in on a browser set to English
- **THEN** It is shown in Spanish

#### Scenario: Switch while signed in
- **WHEN** a signed-in person switches to English
- **THEN** their account language becomes English

### Requirement: Most recent choice wins at sign-in
When a person signs in and the language explicitly chosen on this device differs from the account language, the more recently chosen one SHALL be used and saved to the account.

#### Scenario: Chose on this device after the account was set
- **WHEN** the account says Spanish (set last month) and the person chose English on this device today, then signs in
- **THEN** It stays in English and the account language becomes English

### Requirement: Every interface text available in Spanish
Every fixed text in the app (headings, buttons, labels, tag names and explanations, notes, loading, empty and error messages, accessibility labels) and every email It sends SHALL have a Spanish version. The founder-only content editor's own screens MAY stay in English.

#### Scenario: Error message in Spanish
- **WHEN** published content fails to load while Spanish is active
- **THEN** the error and retry text are in Spanish

### Requirement: English fallback for content
When a content item has no Spanish that may be shown, it SHALL appear in English in its usual place, SHALL stay pickable, and SHALL NOT be hidden or reordered. A single item SHALL NOT mix Spanish and English fields.

#### Scenario: Untranslated pain
- **WHEN** Spanish is active and a pain has no Spanish version
- **THEN** that pain appears in English in its usual position and can be opened and picked

### Requirement: Spanish wording rules
Spanish text SHALL describe giving money as support ("apoyo", "apoyar"), never as a donation ("donación", "donar"), and neither language SHALL describe It as a charity ("caridad", "organización benéfica").

#### Scenario: Support wording in Spanish
- **WHEN** someone reviews every Spanish screen and email
- **THEN** none says "donación", "donar", "caridad" or "organización benéfica"

### Requirement: Locale formatting
Dates, times and numbers SHALL be formatted for the active language. Money SHALL stay in US dollars in both languages, and in Spanish SHALL be labelled so it cannot be read as another currency (for example "US$ 5").

#### Scenario: Amount in Spanish
- **WHEN** a $5 amount is shown in Spanish
- **THEN** it reads as US dollars, for example "US$ 5"

### Requirement: Declared language on web
On web, each page SHALL declare the active language to the browser, and any English item shown on a Spanish page SHALL declare English.

#### Scenario: Spanish page with an English item
- **WHEN** a Spanish page shows one pain in English
- **THEN** the page declares Spanish and that pain declares English

### Requirement: Spoken language on iOS
On iOS, text SHALL be exposed to assistive technology with its language, so Spanish is read with a Spanish voice and English items with an English voice.

#### Scenario: VoiceOver on a Spanish page
- **WHEN** VoiceOver reads a Spanish page with one English item
- **THEN** the Spanish is read in a Spanish voice and the English item in an English voice

### Requirement: Text fits in both languages
No text in either language SHALL be cut off, clipped or overlapped at the smallest supported screen width and the largest supported text size.

#### Scenario: Long Spanish button
- **WHEN** the personal page is shown in Spanish at 320 px wide with text at 200%
- **THEN** every heading, button and tag is fully visible

### Requirement: Language privacy
Before signup, the language choice SHALL stay on the device; it MAY travel only with an email-code request the person starts. Content requests SHALL NOT carry it, nothing SHALL store it for a signed-out person, and measurement messages SHALL NOT carry it. After signup it is stored on the account. It SHALL NOT appear in any public artifact.

#### Scenario: Loading content
- **WHEN** a signed-out person loads the personal page in Spanish
- **THEN** the content request carries no language

#### Scenario: Requesting a code
- **WHEN** a signed-out person requests a sign-in code in Spanish
- **THEN** the request carries only the email and the language, and the server keeps no record of the language for that email unless an account is created

### Requirement: Honest status in every language
Fix tags (Task, Habit, Takes a group, Feature) and feature statuses (Idea, Planned) and their explanations SHALL keep the same meaning in Spanish. A translation SHALL NOT make a proposed It feature or a societal change read as available now.

#### Scenario: Feature explanation in Spanish
- **WHEN** a person taps a Feature tag in Spanish
- **THEN** the explanation says, in Spanish, that It does not offer it yet and choosing it tells It to build it

### Requirement: Language control accessibility
The language control SHALL be reachable and usable by keyboard on web with visible focus, SHALL announce its current language and whether it is open, SHALL announce each option in its own language, SHALL NOT animate when reduced motion is on, and SHALL show the current language as text, not by colour or icon alone.

#### Scenario: Screen reader on the control
- **WHEN** a screen reader focuses the language control while Spanish is active
- **THEN** it announces the control, "Español" as the current value, and whether it is expanded
