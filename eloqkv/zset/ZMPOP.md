---
title: ZMPOP
---

# ZMPOP

Removes and returns one or more members with the highest or lowest scores from one or more sorted sets.

## Syntax

```
ZMPOP numkeys [key ...] MIN|MAX [COUNT count]
```

## Parameters

- **numkeys**: The number of sorted sets from which to pop members.
- **key**: The name of each sorted set involved in the operation.
- **MIN|MAX**: Specifies whether to pop the members with the lowest scores (`MIN`) or the highest scores (`MAX`).
- **COUNT**: Optional. Specifies the number of members to pop. If not provided, the default is 1.

## Details

- **Available since:** 7.0.0
- **Time complexity:** O(K + M\*log(N)) where K is the number of provided keys, M is the number of elements returned, and N is the total number of elements across the provided keys.
- **ACL categories:** `@write`, `@sortedset`, `@slow`

The `ZMPOP` command is used to pop one or more members with the lowest or highest scores from one or more sorted sets. The command removes these members from the sorted sets and returns them along with their scores.

## Examples

### Basic Usage

Assume we have two sorted sets:

```
ZADD set1 1 "a" 2 "b" 3 "c"
ZADD set2 1 "d" 2 "e" 3 "f"
```

To pop the member with the lowest score from `set1`:

```
ZMPOP 1 set1 MIN
```

This will return:

```
1) "set1"
2) 1) "a"
   2) "1"
```

### Popping Multiple Members

To pop the two members with the highest scores from `set2`:

```
ZMPOP 1 set2 MAX COUNT 2
```

This will return:

```
1) "set2"
2) 1) "f"
   2) "3"
   3) "e"
   4) "2"
```

### Popping from Multiple Sets

If you want to pop members from the lowest scores across both `set1` and `set2`:

```
ZMPOP 2 set1 set2 MIN COUNT 3
```

This will return:

```
1) "set1"
2) 1) "a"
   2) "1"
   3) "b"
   4) "2"
```

## Edge Cases

- If all the keys are empty or do not exist, `ZMPOP` returns a null reply.
- If the key exists but is not a sorted set, an error is returned.
- If the specified `COUNT` is greater than the number of available members, all members are returned.

## RESP2/RESP3 Reply

- Array reply: The name of the key from which members were popped, followed by the list of members and their scores.
