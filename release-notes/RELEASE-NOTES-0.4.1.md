# Morelord Craftworks 0.4.1

Morelord Craftworks 0.4.1 adopts the shared Morelord product interface and improves consistency across its workflows.

## What Changed

### Improvements

- Migrated Craftworks applications, settings, dashboards, browsers, generators, chat cards, statuses, and actions to Core-owned components and semantic tokens.
- Standardized readable `ml-craftworks-*` and `ml-craftworks-harvest-*` selectors.
- Split the manifest stylesheet into foundation and workflow feature styles.
- Standardized award-card and hoard-card typography and interaction behavior.
- Improved dashboard card sizing so descriptions and localized labels remain contained.

### Fixed

- Fixed stale chat-card dataset bindings after namespace migration.
- Fixed warning, success, failure, readiness, and crafting-progress states using inconsistent feature colors.
