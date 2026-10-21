# What the frozen engine can represent

**Draft, round 2.** This records a check of every convention in the round 2 guide against the frozen engine (tag `situation-graph-v3.1-frozen`), so the guide doesn't promise anything the engine can't do. The checks were run in the browser against the prototype's `Graph` module, using a small childcare graph built for the purpose.

| Convention in the guide | Check | Result |
|---|---|---|
| One fact per day for coverage, each yes, no, or not checked | Built a fact with no value | **Represented.** It stays "not checked"; nothing infers "no" from silence. |
| An arrangement that already exists, recorded as a fact | A "Mom on Tuesdays" fact that provides "Tuesday covered" | **Represented.** "Yes" provides the condition, and "no" removes it. |
| An arrangement that ends | Set the fact to "no" | **Partly represented.** The condition goes, but **a fact keeps no history**: nothing records that it used to be true, or when it changed. Authors should say so in prose. |
| A need that points at another fix's outcome | Gave "ask the manager" an outcome that provides "later start on Wednesday", needed by a Wednesday fix | **Represented,** through conditions. |
| A partial result: approval for one day | The outcome "Agreed Wednesday only" provides Wednesday but not Thursday | **Represented.** The Wednesday fix shows the need as met; the Thursday fix shows it as not yet in place. It takes one condition per day, and one fix per day where the days differ. |
| A later outcome that withdraws an earlier one, from the same source | The manager reverses the agreement | **Represented.** The condition is withdrawn. |
| A withdrawal that should change a dependent fix that has already happened | The manager reverses; the Wednesday daycare outcome "Going" was already recorded | **Not expressible.** The dependent fix still shows "went as hoped", and nothing warns. An author has to record a new outcome on the dependent fix; the engine won't do it for them. This is a finding for a future engine version, and the engine stays frozen for round 2. |
| Where a claim comes from (the notes, something heard, or the author's own structure) | — | **Not represented.** It's an authoring annotation only; the engine has no field for it. |
| A bounded gap: what is known, what is unresolved, what would resolve it | — | **Partly represented.** The engine shows "no modeled way yet" when nothing provides a needed condition. The gap's description is prose. |
