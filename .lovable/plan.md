Update the assessment form Step 2 (industry selection) to match the provided screenshot.

**Changes:**
1. Add a `STEP2_OPTIONS` constant in `src/components/commercial/InlineAssessmentForm.tsx` with four custom options:
   - "RV Park, Motorcoach, Campground" (maps to slug `rv-parks`)
   - "Marinas" (maps to slug `marinas`)
   - "Winery / Equestrian" (maps to slug `mobile-home-parks`)
   - "Other Large Property" (maps to slug `large-properties`)
   Each option has a custom tagline matching the screenshot.

2. Replace the `INDUSTRIES.map()` rendering in the `select` step with `STEP2_OPTIONS.map()`.

3. Change the grid layout from `grid-cols-2 md:grid-cols-3` to `grid-cols-2` so all breakpoints show a 2×2 grid.

4. Handle selection state so the combined "RV Park, Motorcoach, Campground" option also appears selected if the underlying value is `campgrounds` or `motorcoach-resorts`.

**Verification:**
- Open `/assessment` and advance to Step 2.
- Confirm four cards appear in a 2×2 grid with the exact labels and taglines from the screenshot.
- Confirm selection highlight (primary border + bg-primary/20) works on click.
- Confirm Continue and Back navigation still function.