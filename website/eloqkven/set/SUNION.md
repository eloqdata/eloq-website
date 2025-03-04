---
title: SUNION
---

# SUNION

Returns the members of the set resulting from the union of all the given sets.

## Syntax

```
SUNION key [key ...]
```

## Parameters

- **key**: One or more keys representing the sets to be combined.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the total number of elements in all the sets.
- **ACL categories:** `@read`, `@set`, `@fast`

The `SUNION` command computes the union of multiple sets and returns all the unique members. The union of two or more sets includes every element that is present in at least one of the sets.

## Examples

### Union of Two Sets

Assume we have the following sets:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
```

To get the union of `set1` and `set2`:

```
SUNION set1 set2
```

This will return:

```
1) "a"
2) "b"
3) "c"
4) "d"
```

### Union of Multiple Sets

Assume we have more sets:

```
SADD set3 "e" "f"
SADD set4 "g" "h"
```

To get the union of `set1`, `set2`, `set3`, and `set4`:

```
SUNION set1 set2 set3 set4
```

This will return:

```
1) "a"
2) "b"
3) "c"
4) "d"
5) "e"
6) "f"
7) "g"
8) "h"
```

## Edge Cases

- If any of the keys do not exist, they are treated as empty sets.
- If no keys are specified, `SUNION` returns an empty list.
- The order of the returned elements is not guaranteed to be the same as the order of the input keys.

## RESP2/RESP3 Reply

- Array reply: list of elements in the union of the sets.
