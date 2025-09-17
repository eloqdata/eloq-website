---
title: ZDIFFSTORE
---

# ZDIFFSTORE

Computes the difference between the first sorted set and all successive sorted sets, and stores the resulting sorted set in a new key.

## Syntax

```
ZDIFFSTORE destination numkeys key [key ...]
```

## Parameters

- **destination**: The key where the result of the difference will be stored.
- **numkeys**: The number of sorted sets involved in the operation, including the first set.
- **key**: The name of each sorted set involved in the operation.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N + M log(M)) where N is the size of the input sorted sets and M is the size of the result set.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZDIFFSTORE` command computes the difference between the first sorted set and all the successive sorted sets, similar to `ZDIFF`, but instead of returning the result, it stores the resulting sorted set at the specified `destination` key.

## Examples

Assume we have three sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "c" 2 "d"
ZADD set3 1 "a"
```

To compute the difference between `set1` and the other sets, and store the result in `diffset`:

```
ZDIFFSTORE diffset 3 set1 set2 set3
```

After running this command, the `diffset` will contain:

```
ZRANGE diffset 0 -1 WITHSCORES
```

This will return:

```
1) "b"
2) "2"
```

## Edge Cases

- If the destination key already exists, it will be overwritten with the new result.
- If the first set is empty, `ZDIFFSTORE` will store an empty sorted set at the destination key.
- If there are no members left after subtracting all the successive sets, an empty sorted set will be stored at the destination key.
- If the destination key refers to a non-sorted set data type, it will be replaced by the result sorted set.

## RESP2/RESP3 Reply

- Integer reply: the number of elements in the resulting sorted set stored at the destination key.
