# DealProof — Black Friday deals, checked and graded honestly

![Competition](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/donghua9711-oss/black-friday-deal-finder-01/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/donghua9711-oss/black-friday-deal-finder-01/reward.svg)

A static deal-finder site for Black Friday 2026. Every deal on the board was
found and checked by hand on Friday 27 November 2026, the day the sales were
live: product, store, a link to the product at that store, the sale price,
the usual price, the discount, the time the price was checked (UTC) and the
source it was read from.

What makes it different is the honesty grade on every deal, weighed from the
evidence rather than the retailer's banner:

- **Verified new low** — the lowest price tracked for that product.
- **Strong price** — a deep, genuine cut under the usual street price.
- **Routine sale** — a real cut, but one the store repeats through the year.
- **Inflated anchor** — the "usual" price was freshly hiked or is a
  store-brand anchor, so the headline percent overstates the saving.

Shoppers can search the board and filter it by category, store and minimum
discount, and sort it by the DealProof score (cut size + dollars saved +
honesty grade), by percent off, by dollars saved or by price. Products sold
at more than one store are also listed side by side in a price-check strip,
cheapest first, each with its own grade.

## Run it

```
node serve.ts        # serves app/ at http://localhost:8080
node --test test/    # unit tests for the scoring, filtering and sorting
```

`main.ts` is the hand-in program: it copies `app/` and `screenshots/` to the
output folder and writes `dossier.json` with the vendored make.fun library.

## Layout

- `app/index.html` — the page: masthead, search and filter controls, board.
- `app/data.js` — the 29 checked deals, each with its evidence and grade.
- `app/logic.js` — pure scoring, filtering and sorting (unit-tested).
- `app/views.js` — DOM rendering for cards, price checks and deal pages.
- `app/main.js` — hash routing and control wiring.
- `app/style.css` — the DealProof look.
