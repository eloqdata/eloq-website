---
title: SDIFF
---

# SDIFF

Returns the members of the set resulting from the difference between the first set and all the successive sets.

## Syntax

```
SDIFF key [key ...]
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the total number of elements in all given sets.
- **ACL categories:** `@read`, `@set`, `@slow`

## Example

Assume we have three sets: `set1`, `set2`, and `set3` with the following members:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
SADD set3 "c" "d" "e"
```

Now, let's find the difference between `set1` and `set2`:

```
SDIFF set1 set2
```

This will output:

```
1) "a"
```

## RESP2/RESP3 Reply

Array reply: list of members in the resulting set.
