# Data Model


## User
```json
{
  "id": "string",
  "nickname": "string",
  "level": 1,
  "xp": 0,
  "coin": 0,
  "diamond": 0
}
```

## Subject
```json
{
"id": "string",
"name": "English",
"level": 1,
"xp": 0,
"totalMinutes": 0,
"isArchived": false
}
```

`isArchived` — subjects with existing `StudySession` history are **archived**
rather than deleted, to preserve historical dashboard stats. Archived subjects
are hidden from the active subject list/timer selector but still resolve for
past sessions and charts. See `01_analysis/requirements.md` FR-S3.

## StudySession
```json
{
"id": "string",
"subjectId": "string",
"duration": 60,
"createdAt": "date"
}
```

## Item
```json
{
"id": "string",
"name": "Wizard Hat",
"price": 100,
"currency": "coin",
"type": "hat"
}
```

`currency` is `"coin" | "diamond"`. Coin-priced items are everyday cosmetics
affordable from normal session rewards; diamond-priced items are rare, premium
cosmetics only obtainable via character level-up milestones (see
`01_analysis/requirements.md` §4).

`Item`s themselves are a static catalog (`lib/itemCatalog.ts`), not persisted
per-user data — the catalog has no admin UI and is edited directly in code.

## Inventory

```json
{
"ownedItemIds": ["wizard-hat"],
"equippedItemId": "wizard-hat"
}
```

The per-user part of the shop: which catalog items are owned, and which one
(if any) is currently equipped. v1 supports a single equipped item overall,
not per-slot equipping (e.g. one hat + one outfit at once) — FR-P4 only asks
for "an item," and the character placeholder has no layered sprite system to
render multiple simultaneously equipped pieces yet.