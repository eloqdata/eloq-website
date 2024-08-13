---
title: ZINTER
---

# ZINTER

Computes the intersection of multiple sorted sets and returns the resulting members. By default, the resulting members are sorted by their score in ascending order.

## Syntax

```
ZINTER numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
```

## Parameters

- **numkeys**: The number of sorted sets involved in the intersection.
- **key**: The name of each sorted set involved in the operation.
- **WEIGHTS**: Optional. Specifies a multiplication factor for each sorted set’s scores. If not specified, the default weight is 1 for all sets.
- **AGGREGATE**: Optional. Specifies how to combine the scores of elements that exist across multiple sets. The options are `SUM` (default), `MIN`, or `MAX`.
- **WITHSCORES**: Optional. Returns the resulting members with their scores.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N\*K + M log(M)) where N is the size of the input sorted sets, K is the number of sets, and M is the number of elements in the result.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZINTER` command computes the intersection of the specified sorted sets. The resulting set consists of members that are present in every one of the specified sets. If a member is present in multiple sets, its score in the result is calculated based on the `WEIGHTS` and `AGGREGATE` options.

## Examples

### Basic Usage

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "b" 2 "c" 3 "d"
ZADD set3 1 "c" 2 "d" 3 "e"
```

To find the intersection of these sets:

```
ZINTER 3 set1 set2 set3
```

This will return:

```
1) "c"
```

### Using the WEIGHTS Option

To multiply the scores of `set1` by 2, `set2` by 3, and `set3` by 1 before computing the intersection:

```
ZINTER 3 set1 set2 set3 WEIGHTS 2 3 1
```

This will compute the intersection with weighted scores.

### Using the AGGREGATE Option

To find the intersection but keep the minimum score from the sets for each member:

```
ZINTER 3 set1 set2 set3 AGGREGATE MIN
```

### Including Scores in the Result

To return the members of the intersection along with their scores:

```
ZINTER 3 set1 set2 set3 WITHSCORES
```

This will return:

```
1) "c"
2) "score_of_c"
```

## Edge Cases

- If the intersection is empty, `ZINTER` will return an empty array.
- If the key does not exist, it is treated as an empty set.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the intersection, optionally with their scores if `WITHSCORES` is specified.
