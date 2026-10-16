# It MVP --- Tier 1 Pains and Dreams

## Tiering rule

Tier 1 contains three items per domain where the domain can carry it,
and two where it cannot. Everything else remains real but is held at
Tier 2.

## Personal

### Body

-   **Poor sleep** --- I don't sleep well. → **Rested** --- I wake up
    ready.
-   **Out of shape** --- I don't move enough. → **Strong** --- my body
    can do what I ask.

### Head

-   **Anxiety** --- I worry too much. → **Calm** --- my head is quiet.
-   **Burnout** --- I've got nothing left. → **Recovered** --- I have
    something left at the end of the day.
-   **Overwhelmed** --- there's too much at once. → **On top of it** ---
    I know what today is for.

### Money

-   **Broke** --- money is always tight. → **Steady** --- a bad month
    stays a bad month. / **Comfortable** --- I don't think about money
    much. / **Free** --- I don't work just to live.
-   **Underpaid** --- my work is worth more. → **Paid fairly** --- what
    I get matches what I do.

### Time

-   **Doomscrolling** --- I lose my nights to my phone. → **Present**
    --- my evenings are mine.
-   **No free time** --- none of it is mine. → **Unhurried** --- there's
    room in the day.

### People

-   **Loneliness** --- I feel alone. → **Belonging** --- my people are
    close by.
-   **Nobody to do things with** --- I'd go if someone asked. → **A
    regular thing** --- there's something on the calendar with people in
    it.
-   **Drifted apart** --- I've lost touch with people who matter. →
    **Back in touch** --- I see them and it's easy again.

### Doing

-   **Procrastination** --- I put things off. → **Follow-through** --- I
    do what I said I'd do.
-   **No path** --- I know what I want and not how. → **The next step**
    --- the way there is obvious from here.
-   **Meaningless work** --- my work doesn't matter. → **Purpose** ---
    my work is worth doing.

## World

### Power

-   **They don't listen** --- nobody in charge answers to me. → **Real
    representation** --- my rep actually calls back.
-   **I don't know who to vote for** --- the ballot is a guess. →
    **Confident at the ballot** --- I vote knowing what I'm voting for.
-   **No accountability** --- they say anything and nothing follows. →
    **Watched** --- we know who kept their promises.

### Economy

-   **Rent eats everything** --- housing takes half. → **Affordable
    housing** --- rent leaves room for a life.
-   **One illness away** --- getting sick would ruin me. →
    **Healthcare** --- you get care when you need it.
-   **It all goes up** --- the people who own things get everything. →
    **Shared ownership** --- the profit stays here.

### Each other

-   **Nobody knows anybody** --- my street is strangers. → **Real
    community** --- there are people here who show up.
-   **We can't talk** --- disagreeing ends it. → **Common ground** ---
    we argue and still get things done.

### Dignity

-   **Treated differently** --- who I am counts against me. → **Taken as
    I am** --- I walk in and it's not a factor.
-   **People get treated badly for who they are** --- I watch it happen.
    → **Everyone's counted in** --- nobody has to shrink to be safe
    here.

### Information

-   **I don't know what's true** --- everything contradicts everything.
    → **Honest news** --- I trust what I read.
-   **Nobody covers here** --- I don't know what's happening in my own
    town. → **Local coverage** --- someone reports on this place.

### Change

-   **Nothing ever changes** --- we all know the problem and it stays. →
    **Momentum** --- things we agree on actually happen.
-   **Shouting into the void** --- I care and it goes nowhere. → **It
    counted** --- what I did showed up somewhere.
-   **Alone in caring** --- I don't know who else gives a damn. →
    **Found my people** --- there's a group and it's local.

## Design notes

**"Nobody to do things with" and "Loneliness" both stay** even though
they overlap, because they're different people. One is a state, one is a
logistics complaint --- and the second is the single most fixable item
on the whole board, so it's the best possible thing for someone to tap
early.

**Dignity sits between "Each other" and "Information" deliberately**,
not at the end. At the end it reads as an appendix; between two ordinary
domains it reads as ordinary.

**"The turnaround" is gone.** It may still be worth testing as a single
item at the bottom of the world screen rather than placing it in a
group.

## Tier 2 candidates

In rough expected-frequency order:

Debt · Chronic pain · Drinking too much · Can't focus · Wrong career ·
No close friends · Home is hard · Kids' future · Climate · AI · Hunger ·
Where you're born · Local control · A floor · Corruption.

## Implementation note

Tier 1 is the onboarding presentation surface, not the full ontology.
The larger researched pain corpus remains available underneath it as
Tier 2. Tier 1 items should route into more specific pains, dreams, and
interventions without implying that selecting a broad item endorses
every child beneath it.

For implementation, dream mappings should support one-to-many
relationships: **Broke**, for example, maps to **Steady**,
**Comfortable**, and **Free**, rather than to a single canonical
inverse.
