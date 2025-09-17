---
title: SINTERSTORE
---

# SINTERSTORE

Stores the members of the set resulting from the intersection of all the given sets.

## Syntax

```
SINTERSTORE destination key [key ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N\*M) worst-case, where N is the cardinality of the smallest set and M is the number of sets.
- **ACL categories:** `@write`, `@set`, `@slow`

## Example

Assume we have three sets: `set1`, `set2`, and `set3` with the following members:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
SADD set3 "c" "d" "e"
```

Now, let's store the intersection of all three sets in a new set called `inter_set`:

```
SINTERSTORE inter_set set1 set2 set3
```

## RESP2/RESP3 Reply

Integer reply: the number of elements in the resulting set.
