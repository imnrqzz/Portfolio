# Case Study: Shoe Inventory System

**Role:** Head programmer, team of 5
**Stack:** PHP, MySQL, JavaScript, HTML, CSS, React (storefront customizer)
**Live:** https://inventorysole.free.nf/frontend/login.php
**Demo account:** User: mark / Password: mark123
**Repo:** https://github.com/imnrqzz/ShoeInventorySystem
**Status:** v1 done, v2 in progress

## The problem

A shoe business needed one place to run the whole operation: track stock, manage suppliers, record transactions, and see what was selling. Before this, the pieces lived in separate files and spreadsheets, so nobody had a clear picture of inventory or sales.

## What the system does

- Admin inventory dashboard with sales and stock insights
- Item and variant management with photo support
- Supplier management
- Stock updates with transaction logging
- User management with role-based access
- Sales reporting and transaction history
- Storefront with product catalog, search filtering, and shopping cart
- A 3D shoe customizer (React/Vite)

## My contribution

As head programmer on a team of 5, I built the full CRUD flows, search, auth, and sales reporting in PHP/MySQL:

- `api/` endpoint layer: auth, items, stock, restock, suppliers, transactions, users
- `backend/Classes/`: separation into Database, StockManager, ItemManager, SupplierManager, TransactionManager, UserManager
- `backend/handlers/`: login, register, transaction, user action handlers
- Dashboard, items, stock, supplier, reports views with their own CSS
- Image upload handling and stock-to-item sync

### One architecture decision I made

I organized the backend into manager classes with a separate API endpoint layer instead of writing SQL directly inside each page. The pattern: page → API endpoint → manager class → database. That kept views free of raw queries, so when the team needed a new feature (restock, variants), we added an endpoint + manager method instead of touching every page.

**The alternative I rejected:** flat procedural scripts with SQL inline in each page. It would have shipped faster at first, but every feature would have meant editing multiple pages and repeating the same query logic. The class + API layer cost more upfront but made the rest of the project (and a 5-person team working in parallel) much safer to change.

## The hard part

The storefront's checkout and auth flow. The commit history shows this was the messiest area: CSRF token mismatches between sessions (fixed with a session-stable token), session cookie path collisions (cleared legacy path-restricted cookies), and strict auth guards redirecting to login. The registration email even broke page redirects once because of debug echo output. Those were the classic "works on my machine, breaks in the browser" problems — the data was fine, but session state and redirect behavior kept biting us until the token and cookie paths were handled properly.

## Result

Shipped a working production-style system with a team of 5: 6 API endpoint groups (auth, items, stock, restock, suppliers, transactions, users), 7 manager classes, an admin dashboard covering stock/suppliers/users/sales, plus a storefront with cart, search, and a 3D customizer. All the core flows are committed in the repo with a full commit history — not a tutorial clone, a real system that runs live.

## What I'd do differently (v2)

Rebuilding v2 with a cleaner architecture. The v1 worked, but as it grew the coupling between some pages and the data layer got harder to change safely. v2 is about separating concerns properly and making the codebase easier to extend.