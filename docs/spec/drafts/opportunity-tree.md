# Opportunity solution tree, appetite, no-gos — DRAFT

## Outcome

A visitor, in minutes, finds something that matters to them, sees a plausible new future and a useful next step, and then independently judges whether It deserves to exist (spec §18). Measured by: dream selected → idea seen → (some) save / donate / offer.

## Tree

```
Outcome: visitors see a better future + a useful step, and some choose to support or help
├── O1 "I can't name what better would look like"
│   ├── S1.1 Multiple first-person dreams per pain (incl. non-obvious: "live well regardless of employment")
│   └── S1.2 Selected dream takes over the collapsed item
│       └── A: people pick ≥1 dream on ≥1 pain       → test: funnel, 5 hallway sessions
├── O2 "I don't know what could actually help"
│   ├── S2.1 Ideas appear instantly, grouped per dream, with honest status
│   └── S2.2 Personal / It-feature / societal ideas side by side
│       ├── A: seeded ideas feel useful, not generic → test: "what new possibility did you see?"
│       └── A: people can tell real-now vs proposed   → test: ask after session; acceptance test 8
├── O3 "I care about things beyond my own life"
│   └── S3.1 Same mechanics for "What could be better for us?"
│       └── A: societal stage isn't skipped by most   → test: completion rate personal vs societal
├── O4 "I don't want to lose this"
│   └── S4.1 Signup required after personal + societal pages (password or passwordless)
│       └── A: people who picked dreams sign up rather than leave → test: signup rate at the gate
├── O5 "I'd support this if I trusted it"
│   └── S5.1 Candid appeal + same-page donation + real numbers
│       ├── A: candor raises trust, not "what's the catch" → test: qualitative + support-page→checkout
│       └── A: merchant onboarding finishes in time  → test: start Day 1; fallback hosted option
└── O6 "I could help build this"
    └── S6.1 Help form with consent; manual follow-up
        └── A: offers arrive and are followable       → test: count consenting offers, founder follow-up in 48h
```

Riskiest assumption first: **O2 usefulness of seeded ideas** (and Tier 1 content isn't recovered yet — spec §17.1). Test with paper/hallway sessions on Day 1–2 before polishing UI.

## Appetite

**One week** (Shape Up small batch), founder + coding agents. Fixed time, variable scope. If the week ends, cut scope — not quality of what ships, and never the honesty labels.

Scope hammers (cut in this order if late): comparison sidebar → societal section depth (fewer items) → admin view becomes SQL queries → idea-interest on Page 1 → native build (web only).

## No-gos (v0.1)

Story / "Your story" · sharing · invitations / referral · growth math · matching or coalition formation · positive-dream entrance (optional "Something else" only if free) · AI agents · graph DB · plugin marketplace · elaborate profiles · public activity · fake live metrics · "tax deductible" claims · account gate before Page 1.

## Rabbit holes to avoid

Dream-takeover animation (use a simple crossfade; respect reduced motion) · generic content editor · per-user ranking · perfect accessible disclosure on native (web first).
