---
title: SREM
---

# SREM

Removes one or more members from the set stored at `key`.

## Syntax

```
SREM key member [member ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the number of members being removed.
- **ACL categories:** `@write`, `@set`, `@fast`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's remove "member2" and "member3" from `myset`:

```
SREM myset "member2" "member3"
```

## RESP2/RESP3 Reply

Integer reply: the number of members that were removed from the set, not including non-existing members.
