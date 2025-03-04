---
title: ZUNIONSTORE
---

# ZUNIONSTORE

Computes the union of multiple sorted sets, aggregates their scores, and stores the result in a new sorted set.

## Syntax

```
ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
```

## Parameters

- **destination**: The key where the result of the union will be stored.
- **numkeys**: The number of sorted sets involved in the operation.
- **key**: The name of each sorted set involved in the union.
- **WEIGHTS**: Optional. Specifies a multiplication factor for each sorted set’s scores. If not specified, the default weight is 1 for all sets.
- **AGGREGATE**: Optional. Specifies how to combine the scores of members that exist across multiple sets. The options are `SUM` (default), `MIN`, or `MAX`.

## Details

- **Available since:** 2.0.0
- **Time complexity:** O(N) + O(M log(M)) with N being the sum of the input sorted sets, and M being the number of elements in the resulting set.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZUNIONSTORE` command computes the union of the specified sorted sets, aggregates their scores, and stores the resulting sorted set at the `destination` key. The resulting members are ordered by their scores in ascending order.

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

To compute the union of these sets and store the result in `resultset`:

```
ZUNIONSTORE resultset 3 set1 set2 set3
```

After running this command, the `resultset` will contain:

```
ZRANGE resultset 0 -1 WITHSCORES
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

To multiply the scores of `set1` by 2, `set2` by 3, and `set3` by 1 before computing the union and storing the result:

```
ZUNIONSTORE resultset 3 set1 set2 set3 WEIGHTS 2 3 1
```

This will store the result with weighted scores in `resultset`.

### Using AGGREGATE

To compute the union and store the result in `resultset` while keeping the maximum score for each member:

```
ZUNIONSTORE resultset 3 set1 set2 set3 AGGREGATE MAX
```

## Edge Cases

- If the destination key already exists, it will be overwritten with the new result.
- If a key does not exist, it is treated as an empty set.
- If any of the input sets are empty, the result will be an empty set.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the resulting sorted set stored at the destination key.
