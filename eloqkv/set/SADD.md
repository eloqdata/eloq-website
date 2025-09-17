---
title: SADD
---

# SADD

Adds one or more members to a set stored at `key`.

## Syntax

```
SADD key member [member ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of members being added.
- **ACL categories:** `@write`, `@set`, `@fast`

## Example

Assume we have an empty set called `myset`. Now, let's add some members to it:

```
SADD myset "member1" "member2" "member3"
```

## RESP2/RESP3 Reply

Integer reply: the number of elements that were added to the set, not including all the elements already present in the set.
