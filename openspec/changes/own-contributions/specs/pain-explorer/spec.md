# Spec Delta

## ADDED Requirements

### Requirement: Futures follow each pain's order
An open pain SHALL list its futures in that pain's positions, the person's own futures included at the positions they chose. Every joined sentence (collapsed previews and closed-pain summaries) SHALL use the same order, never the order of taps.

#### Scenario: Order of taps ignored
- **WHEN** the person picks "I wake up ready." before "I drift off without a fight." under a pain that positions them the other way
- **THEN** the sentence reads "I drift off without a fight and wake up ready."

#### Scenario: Own future in the sentence
- **WHEN** the person placed their own future between two published futures and picked all three
- **THEN** the sentence joins the three lines in that order
