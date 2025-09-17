---
title: SUNIONSTORE
---

# SUNIONSTORE

Computes the union of multiple sets and stores the resulting set in a new key.

## Syntax

```
SUNIONSTORE destination key [key ...]
```

## Parameters

- **destination**: The key where the result of the union operation will be stored.
- **key**: One or more keys representing the sets to be combined.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N) where N is the total number of elements in all the sets.
- **ACL categories:** `@write`, `@set`, `@slow`

The `SUNIONSTORE` command computes the union of multiple sets and stores the resulting set in the key specified by `destination`. This operation overwrites any existing value at the `destination` key.

## Examples

### Union of Two Sets

Assume we have the following sets:

```
SADD set1 "a" "b" "c"
SADD set2 "b" "c" "d"
```

To compute the union of `set1` and `set2` and store it in `resultset`:

```
SUNIONSTORE resultset set1 set2
```

After running this command, the `resultset` key will contain:

```
S Members of set1 and set2:
1) "a"
2) "b"
3) "c"
4) "d"
```

### Union of Multiple Sets

Assume we have additional sets:

```
SADD set3 "e" "f"
SADD set4 "g" "h"
```

To compute the union of `set1`, `set2`, `set3`, and `set4` and store it in `allsets`:

```
SUNIONSTORE allsets set1 set2 set3 set4
```

After running this command, the `allsets` key will contain:

```
S Members of set1, set2, set3, and set4:
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

- If any of the source keys do not exist, they are treated as empty sets.
- If `destination` already exists, it will be overwritten with the result of the union operation.
- If no source keys are specified, `SUNIONSTORE` creates an empty set at `destination`.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the resulting set stored at `destination`.
