# Spec Delta

## ADDED Requirements

### Requirement: Support page in the active language
The Support page's text, cadence and amount choices, validation messages and outcome messages SHALL appear in the active language. Amounts SHALL stay in US dollars, labelled unambiguously as US dollars in Spanish.

#### Scenario: Amount error in Spanish
- **WHEN** a person with Spanish active enters an amount outside the allowed range
- **THEN** the message is in Spanish and shows the limits as US dollars

### Requirement: Payment form in the active language
On web, the payment form and its messages SHALL be shown in the active language where the payment provider supports it.

#### Scenario: Spanish payment form
- **WHEN** a person with Spanish active opens the payment form
- **THEN** the provider's form labels and errors are in Spanish

### Requirement: Receipts follow the account language
Payment receipts and confirmations from the payment provider SHALL use the supporter's account language, and SHALL follow a later change of account language.

#### Scenario: Spanish receipt
- **WHEN** a person whose account language is Spanish completes a payment
- **THEN** the receipt email is in Spanish and the amount is in US dollars

### Requirement: Founder letter only in approved Spanish
The founder letter SHALL appear in Spanish only when the founder has approved a Spanish version; otherwise it SHALL appear in English, declared as English.

#### Scenario: No approved Spanish letter
- **WHEN** a person with Spanish active opens the Support page and no Spanish letter is approved
- **THEN** the letter is shown in English and declared as English

### Requirement: Switching on the Support page
Switching language on the Support page SHALL keep the chosen cadence and amount, SHALL redraw the payment form in the new language if the provider requires it, and SHALL NOT submit a payment twice.

#### Scenario: Switch after choosing an amount
- **WHEN** a person has chosen monthly $10 and switches to Spanish
- **THEN** monthly and US$ 10 stay chosen and no payment is made

### Requirement: App Store prices on iOS
On iOS, It SHALL show the App Store's own localized price for each purchase and SHALL NOT show a separately converted price.

#### Scenario: Purchase options on iOS
- **WHEN** a person on iOS with Spanish active views App Store support options
- **THEN** each price is the App Store's own text and It adds no converted amount
