# Case Study: SoleHaus Storefront

**Role:** Full-stack developer (solo)
**Stack:** PHP, MySQL, JavaScript, HTML, CSS
**Live:** https://inventorysole.free.nf/storefront/index.php?page=home
**Repo:** https://github.com/imnrqzz/ShoeInventorySystem
**Status:** In progress (public storefront for the Shoe Inventory System)

## The problem

The Shoe Inventory System had an admin side and a storefront, but the storefront's public entry point was broken: clicking "Store" in the sidebar redirected visitors to the *admin* login instead of showing products. On top of that, the deployed build threw HTTP 500s because a required `vendor/` (PHPMailer) folder was never part of the upload, and the account-creation and transaction handlers failed silently (white screens) whenever the database raised an error. The store was effectively unreachable to customers.

## What the storefront does

- Product catalog with brand filtering and search
- Shopping cart with add/remove and subtotal
- Customer accounts with email-verification sign-up (6-digit code)
- Public pages: home, brands, about, product detail, customizer, login/register
- Sits in front of the same inventory/transactions backend as the admin app

## My contribution

As the sole developer on the storefront layer, I diagnosed and fixed the deployment and routing breakages:

- Rewrote `storefront/index.php` as a real front-controller router that dispatches `?page=` to the existing Home / Product / Cart / Auth / Brands / About / Customizer controllers — replacing the one-line redirect-to-admin-login stub that was there before.
- Hardened `backend/handlers/process_user.php` (admin account creation): input validation up front, duplicate-username check, and a try/catch that redirects with an error instead of throwing a raw PDO exception.
- Hardened `backend/handlers/process_transaction.php`: checks the item exists and stock is sufficient before the insert, then wraps `addTransaction` in try/catch with explicit `?error=` codes.
- Removed the hard PHPMailer dependency: `bootstrap.php` now loads `vendor/autoload.php` only if it exists, and `AuthController` no longer `implements` a PHPMailer interface at parse time. The store runs with **zero vendor files**, which also fixed the InfinityFree File Manager going blank (it chokes on folders with 100+ tiny files).

### One architecture decision I made

I kept the existing controller-per-page structure and added a thin router in front of it, rather than rewriting every controller. The router maps `?page=home` → `HomeController::index()`, `?page=product&id=` → `ProductController::show()`, etc. That meant the fix was one new file plus small handler hardening — no controller rewrites, no risk to the working admin app.

**The alternative I rejected:** a full SPA rewrite of the storefront. It would have looked cleaner but thrown away working, tested controllers and blown up the change surface for what was essentially a routing + hardening bug.

## The hard part

The silent failures. On the local repro the handlers actually succeeded against the shipped schema, so the live errors were environmental — most likely a duplicate username or a stock/lock edge case surfacing as an uncaught PDO exception that the server turned into a 500. The fix wasn't "make the query work," it was "make the failure observable and recoverable" so a bad input shows a message instead of a white screen. The missing-`vendor/` 500 was the same class of problem: a hard `require_once` of a file that wasn't in the upload.

## Result

A reachable, browseable storefront on InfinityFree: the "Store" link now lands on the catalog, customers can view products and cart, and account/transaction errors degrade to a visible message instead of crashing. All changes are committed in the ShoeInventorySystem repo.

## What I'd do differently

Wire up the verification-email fallback properly — right now SMTP OAuth isn't configured, so registration completes but can't email the code. I'd add an on-screen code display (or a disabled-email mode) so the storefront is fully usable without SMTP credentials. I'd also add a `.htaccess` rule to hide `.php` extensions and backend paths from public URLs (tracked as a follow-up task).
