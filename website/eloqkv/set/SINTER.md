---
title: SINTER
---

# SINTER

Returns the members of the set resulting from the intersection of all the given sets.

## Syntax

```
SINTER key [key ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N\*M) worst-case, where N is the cardinality of the smallest set and M is the number of sets.
- **ACL categories:** `@read`, `@set`, `@slow`

## Example

Assume we have three sets: `set1`, `set2`, and `set3` with the following members:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
SADD set3 "c" "d" "e"
```

Now, let's find the intersection of all three sets:

```
SINTER set1 set2 set3
```

This will output:

```
1) "c"
```

## RESP2/RESP3 Reply

Array reply: list of members in the resulting set.
