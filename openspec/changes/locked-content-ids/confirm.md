# locked-content-ids: questions for the founder

Answer each by number. "yes" accepts the recommendation. The specs are written to the recommendations; any other answer changes the requirement named.

1. **Which records are locked.** FR-020 names pains, futures and ways.
   - A. Groups, pains, futures and ways (own contributions attach pains to groups).
   - B. Only pains, futures and ways, as FR-020 says.
   - C. Everything, including first actions and sources.
   - Recommendation: A. Affects "Published IDs never change".

2. **What "published" means.**
   - A. Appeared in any published version, including ones later rolled back.
   - B. In the latest published version only.
   - Recommendation: A.

3. **How strong the server-side guard is.**
   - A. The editor locks the field, and publishing or rolling back refuses to drop a published ID unless the founder confirms each one.
   - B. The editor locks the field only; the server does not check.
   - C. Published IDs can never be removed at all (taking a pain out of use waits for the pain-pages "retired" state).
   - Recommendation: A. Affects "Confirm removal of published IDs".

4. **First-time IDs.**
   - A. Publishing lists IDs being published for the first time for the founder to approve, alongside the pain-pages slug approval.
   - B. No extra step.
   - Recommendation: A. Affects "Approve first-time IDs".

5. **A removed ID coming back** (re-added by hand or by rollback).
   - A. Allowed, and treated as the same record.
   - B. Forbidden; a removed ID is retired for good.
   - Recommendation: A.

6. **Placeholder IDs.**
   - A. Refuse to publish IDs still in the editor's placeholder form (`new-…`).
   - B. Allow them.
   - Recommendation: A. Affects "Approve first-time IDs".
