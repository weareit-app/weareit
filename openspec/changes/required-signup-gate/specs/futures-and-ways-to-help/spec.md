# Spec Delta

## REMOVED Requirements

### Requirement: Futures screen
**Reason**: Dreams are shown inline on the personal and societal pages, and the signup gate now follows the societal page directly (founder, 2026-10-17, confirmed 2026-10-19).
**Migration**: `/onboarding/futures` redirects to the societal page; the societal page continues to the signup gate.

### Requirement: Ways to help
**Reason**: Pre-signup help interests are retired; a post-signup "Help build It" page will replace them in its own change, reusing these items as first asks (founder, 2026-10-18).
**Migration**: `/ways-to-help` redirects to the personal page; help interests are no longer collected, stored drafts drop them, and signup does not send them.
