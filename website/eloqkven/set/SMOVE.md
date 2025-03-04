---
title: SMOVE
---

# SMOVE

Moves a member from one set to another set atomically.

## Syntax

```
SMOVE source destination member
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@set`, `@fast`

## Example

Assume we have two sets: `source_set` and `destination_set`, with the following members:

```
SADD source_set "member1" "member2"
SADD destination_set "member3"
```

Now, let's move "member2" from `source_set` to `destination_set`:

```
SMOVE source_set destination_set "member2"
```

## RESP2/RESP3 Reply

Integer reply: `1` if the element was moved, `0` if the element was not found in `source` and no operation was performed.
