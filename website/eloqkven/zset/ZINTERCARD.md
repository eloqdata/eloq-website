---
title: ZINTERCARD
---

# ZINTERCARD

Returns the number of members in the intersection of multiple sorted sets.

## Syntax

```
ZINTERCARD numkeys key [key ...] [LIMIT limit]
```

## Parameters

- **numkeys**: The number of sorted sets involved in the intersection.
- **key**: The name of each sorted set involved in the operation.
- **LIMIT**: Optional. Specifies a limit on the number of members to calculate in the intersection. If the intersection cardinality reaches this limit, the command returns the limit as the result.

## Details

- **Available since:** 7.0.0
- **Time complexity:** O(N\*K) worst case where N is the size of the smallest input sorted set and K is the number of input sorted sets.
- **ACL categories:** `@read`, `@sortedset`, `@slow`

The `ZINTERCARD` command is used to quickly obtain the cardinality (number of members) of the intersection of the specified sorted sets without actually retrieving the intersecting members.

## Examples

### Basic Usage

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "b" 2 "c" 3 "d"
ZADD set3 1 "c" 2 "d" 3 "e"
```

To find the number of members in the intersection of these sets:

```
ZINTERCARD 3 set1 set2 set3
```

This will return:

```
(integer) 1
```

### Using the LIMIT Option

To limit the intersection calculation to 2 members:

```
ZINTERCARD 3 set1 set2 set3 LIMIT 2
```

This will return:

```
(integer) 1
```

The command stops the computation if the intersection cardinality reaches the specified limit.

## Edge Cases

- If the intersection is empty, `ZINTERCARD` will return `0`.
- If the key does not exist, it is treated as an empty set.
- If any of the keys refer to non-sorted set data types, an error is returned.

## RESP2/RESP3 Reply

- Integer reply: the number of members in the intersection of the specified sorted sets.
