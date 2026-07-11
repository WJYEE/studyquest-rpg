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

`type` is an `ItemSlot` (`"hat" | "outfit" | "accessory"`) — the cosmetic
category an item belongs to, which doubles as the equip slot it occupies (see
Inventory below). Introduced as a closed union in v1.2; previously a loose
`string` before the catalog had more than one category.

`Item`s themselves are a static catalog (`lib/itemCatalog.ts`), not persisted
per-user data — the catalog has no admin UI and is edited directly in code.

## Inventory

```json
{
"ownedItemIds": ["wizard-hat", "traveler-cloak"],
"equippedItemIds": { "hat": "wizard-hat", "outfit": "traveler-cloak" }
}
```

The per-user part of the shop: which catalog items are owned, and which item
(if any) is equipped **per slot**. `equippedItemIds` is keyed by `ItemSlot`,
so up to one hat, one outfit, and one accessory can be equipped
simultaneously (v1.2) — a slot with nothing equipped simply has no key. This
replaced v1.1's single global `equippedItemId: string | null`, which could
only track one equipped item overall. `CharacterSprite` renders each slot's
equip state independently (`hasHat`/`hasOutfit`/`hasAccessory`).