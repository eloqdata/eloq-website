---
title: SDIFFSTORE
---

# SDIFFSTORE

Stores the members of the set resulting from the difference between the first set and all the successive sets.

## Syntax

```
SDIFFSTORE destination key [key ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the total number of elements in all given sets.
- **ACL categories:** `@write`, `@set`, `@slow`

## Example

Assume we have three sets: `set1`, `set2`, and `set3` with the following members:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
SADD set3 "c" "d" "e"
```

Now, let's store the difference between `set1` and `set2` in a new set called `diff_set`:

```
SDIFFSTORE diff_set set1 set2
```

## RESP2/RESP3 Reply

Integer reply: the number of elements in the resulting set.
