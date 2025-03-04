---
title: ZUNION
---

# ZUNION

Computes the union of multiple sorted sets and returns the resulting members with their aggregated scores. The members in the resulting set are ordered from the lowest to the highest score.

## Syntax

```
ZUNION numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX] [WITHSCORES]
```

## Parameters

- **numkeys**: The number of sorted sets involved in the operation.
- **key**: The name of each sorted set involved in the union.
- **WEIGHTS**: Optional. Specifies a multiplication factor for each sorted set’s scores. If not specified, the default weight is 1 for all sets.
- **AGGREGATE**: Optional. Specifies how to combine the scores of members that exist across multiple sets. The options are `SUM` (default), `MIN`, or `MAX`.
- **WITHSCORES**: Optional. Returns the resulting members with their aggregated scores.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) + O(M log(M)) with N being the sum of the input sorted sets, and M being the number of elements in the resulting set.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZUNION` command computes the union of the specified sorted sets and returns the members with their aggregated scores according to the specified `AGGREGATE` option. The resulting members are ordered by their scores in ascending order.

### Aggregate Options

- **SUM**: The scores of members that exist in multiple sets are summed.
- **MIN**: The resulting score of a member is the minimum of its scores across the input sets.
- **MAX**: The resulting score of a member is the maximum of its scores across the input sets.

### Weights

The `WEIGHTS` option allows you to multiply the scores of the members in each input sorted set by a specific factor before applying the aggregation.

## Examples

### Basic Usage

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b"
ZADD set2 2 "a" 3 "c"
ZADD set3 3 "a" 4 "d"
```

To compute the union of these sets:

```
ZUNION 3 set1 set2 set3
```

This will return:

```
1) "b"
2) "2"
3) "c"
4) "3"
5) "d"
6) "4"
7) "a"
8) "6"
```

### Using WEIGHTS

To multiply the scores of `set1` by 2, `set2` by 3, and `set3` by 1 before computing the union:

```
ZUNION 3 set1 set2 set3 WEIGHTS 2 3 1
```

This will return:

```
1) "b"
2) "4"
3) "c"
4) "9"
5) "d"
6) "4"
7) "a"
8) "11"
```

### Using AGGREGATE

To compute the union and keep the maximum score for each member:

```
ZUNION 3 set1 set2 set3 AGGREGATE MAX
```

This will return:

```
1) "b"
2) "2"
3) "c"
4) "3"
5) "d"
6) "4"
7) "a"
8) "3"
```

## Edge Cases

- If a key does not exist, it is treated as an empty set.
- If all input sets are empty, the result will be an empty set.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Array reply: list of members in the resulting set, optionally with their scores if `WITHSCORES` is used.
