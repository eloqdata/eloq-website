---
title: ZINTERSTORE
---

# ZINTERSTORE

Computes the intersection of multiple sorted sets and stores the resulting sorted set in a new key. The scores of the elements in the resulting sorted set are computed according to the specified options.

## Syntax

```
ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
```

## Parameters

- **destination**: The key where the result of the intersection will be stored.
- **numkeys**: The number of sorted sets involved in the operation.
- **key**: The name of each sorted set involved in the operation.
- **WEIGHTS**: Optional. Specifies a multiplication factor for each sorted set’s scores. If not specified, the default weight is 1 for all sets.
- **AGGREGATE**: Optional. Specifies how to combine the scores of elements that exist across multiple sets. The options are `SUM` (default), `MIN`, or `MAX`.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N\*K + M log(M)) where N is the size of the input sorted sets, K is the number of sets, and M is the number of elements in the result.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZINTERSTORE` command computes the intersection of the specified sorted sets and stores the result in the `destination` key. The resulting set consists of members that are present in all the specified sets. The score of each member in the result is computed based on the `WEIGHTS` and `AGGREGATE` options.

## Examples

### Basic Usage

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "b" 2 "c" 3 "d"
ZADD set3 1 "c" 2 "d" 3 "e"
```

To find the intersection of these sets and store the result in `resultset`:

```
ZINTERSTORE resultset 3 set1 set2 set3
```

After running this command, the `resultset` will contain:

```
ZRANGE resultset 0 -1 WITHSCORES
```

This will return:

```
1) "c"
2) "6"
```

### Using the WEIGHTS Option

To multiply the scores of `set1` by 2, `set2` by 3, and `set3` by 1 before computing the intersection:

```
ZINTERSTORE resultset 3 set1 set2 set3 WEIGHTS 2 3 1
```

### Using the AGGREGATE Option

To find the intersection but keep the minimum score from the sets for each member:

```
ZINTERSTORE resultset 3 set1 set2 set3 AGGREGATE MIN
```

## Edge Cases

- If the destination key already exists, it will be overwritten with the new result.
- If the intersection is empty, the destination key will be set to an empty sorted set.
- If any of the input keys do not exist, they are treated as empty sets.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the resulting sorted set stored at the destination key.
