---
title: ZINCRBY
---

# ZINCRBY

Increments the score of a member in a sorted set by the specified increment. If the member does not exist in the sorted set, it is added with the specified score as its initial value.

## Syntax

```
ZINCRBY key increment member
```

## Parameters

- **key**: The name of the sorted set.
- **increment**: The amount by which the score of the member should be increased. This can be a positive or negative floating-point number.
- **member**: The member whose score should be incremented.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(log(N)) where N is the number of elements in the sorted set.
- **ACL categories:** `@write`, `@sortedset`, `@fast`

If the member does not exist in the sorted set, `ZINCRBY` adds it with the specified increment as its score. If the member exists, the score is updated by adding the increment to the existing score.

## Examples

### Basic Usage

Assume we have a sorted set called `myzset` with the following members:

```
ZADD myzset 1 "member1" 2 "member2"
```

To increment the score of `member1` by 3:

```
ZINCRBY myzset 3 "member1"
```

This will return:

```
"4"
```

To decrement the score of `member2` by 1.5:

```
ZINCRBY myzset -1.5 "member2"
```

This will return:

```
"0.5"
```

### Adding a New Member

If the member does not exist, it will be added with the increment as its score:

```
ZINCRBY myzset 5 "member3"
```

This will return:

```
"5"
```

## Edge Cases

- If the key does not exist, a new sorted set is created with the specified member and score.
- If the increment is zero, the command simply returns the current score of the member without modifying the sorted set.
- If the member's score becomes NaN (not a number) as a result of the increment, the operation fails.

## RESP2/RESP3 Reply

- Bulk string reply: the new score of the member after the increment is applied.
