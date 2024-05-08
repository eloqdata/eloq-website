---
title: SMEMBERS
---

# SMEMBERS

Returns all the members of the set stored at `key`.

## Syntax

```
SMEMBERS key
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N), where N is the set cardinality.
- **ACL categories:** `@read`, `@set`, `@slow`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's retrieve all members from `myset`:

```
SMEMBERS myset
```

This will output:

```
1) "member1"
2) "member2"
3) "member3"
```

## RESP2/RESP3 Reply

Array reply: list of members in the set.
