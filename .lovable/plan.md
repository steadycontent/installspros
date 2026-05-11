Fix the submissions page so the domain breakdown uses the exact same criteria as Total Submissions, Full Submissions, Partial Submissions, and the table.

Plan:
1. Update `admin-submissions` so the domain breakdown uses the already-parsed `start_date` and `end_date` request values instead of calculating its own UTC “today”.
2. Keep the domain query on the same `leads.created_at >= startDate` and `<= endDate` window used by the other counts.
3. Rename the returned field from `domainsToday` to a range-based name, while keeping a backward-safe fallback if needed.
4. Update the admin UI title from “Submissions by domain — Today” to “Submissions by domain” so it correctly reflects the selected range.
5. Verify the TypeScript hook/UI types match the updated response shape.