# Working licensing decisions

These decisions are accepted as the current working policy. The exact license files and contribution gate will be added before outside contributions are accepted.

| Material                                         | Working license   | Boundary                                                                                                                                      |
| ------------------------------------------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| App and server                                   | AGPL-3.0-or-later | Includes the App Store exception once its exact scope is prepared and reviewed.                                                               |
| Standalone SDKs and public protocol              | Apache-2.0        | Must work independently; never import AGPL application code. Shared types qualify only when generated from the public protocol specification. |
| Knowledge-graph claims and open research dataset | CC0               | Record provenance and respect source licenses, privacy, and applicable non-copyright rights.                                                  |
| Guides and authored prose                        | CC BY-SA 4.0      | Contributor attribution-removal requests honored where reasonably practicable.                                                                |
| Illustrations                                    | CC0               | Keep generation, source, selection, human editing, and SVG cleanup provenance.                                                                |

AGPL does not require the hosted service to be free of charge. The project's promise that It's core remains available to self-host belongs in governance and operating policy, not in the license alone.

The following need concrete documents before accepting outside contributions:

1. Exact AGPL App Store exception text and scope.
2. Contribution mechanism: DCO or CLA, including what rights are granted for each content class.
3. Trademark policy and governance protections for the mission and project name.

The code license should be AGPL-3.0-or-later. This allows users to use later GNU AGPL versions; it is not a blanket grant for maintainers to relicense contributions under arbitrary terms.
