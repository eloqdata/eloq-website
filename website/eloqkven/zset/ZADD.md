---
title: ZADD
---

# ZADD

Adds one or more members to a sorted set, or updates the score of members that already exist. This command is often used in applications that need to maintain ordered lists, such as leaderboards or priority queues.

## Syntax

```
ZADD key [NX|XX] [CH] [INCR] score member [score member ...]
```

## Parameters

- **key**: The name of the sorted set.
- **NX**: Only add new elements, do not update existing ones.
- **XX**: Only update existing elements, do not add new ones.
- **CH**: Modify the return value from the number of new elements added, to the total number of elements changed (CH is an abbreviation for _changed_).
- **INCR**: Increment the score of an existing member by the specified amount.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(log(N)) for each item added, where N is the number of elements in the sorted set.
- **ACL categories:** `@write`, `@sortedset`, `@fast`
- **Flags:**
  - `NX` ensures that the command only adds elements that do not already exist.
  - `XX` ensures that the command only updates elements that already exist.
  - `CH` returns the number of elements added or updated.
  - `INCR` increments the score of the specified element by the given value.

## Examples

### Basic Usage

Add members to a sorted set with their respective scores:

```
ZADD myzset 1 "member1" 2 "member2" 3 "member3"
```

### Using the NX Option

Add a new member only if it does not exist:

```
ZADD myzset NX 4 "member4"
```

### Using the XX Option

Update the score of an existing member:

```
ZADD myzset XX 5 "member1"
```

### Using the CH Option

Return the number of elements added or updated:

```
ZADD myzset CH 6 "member1" 7 "member5"
```

### Using the INCR Option

Increment the score of an existing member:

```
ZADD myzset INCR 2 "member1"
```

## Edge Cases

- If `ZADD` is called with both `NX` and `XX`, it will always fail as both flags contradict each other.
- When using `INCR`, the command returns the new score of the member instead of the number of added elements.
- If the key does not exist, a new sorted set is created before adding the members.

## RESP2/RESP3 Reply

- Integer reply:
  - If the `INCR` option is not specified, the command returns the number of elements added to the sorted set, not including all the elements already present.
  - If the `CH` option is specified, the command returns the total number of elements changed (added or updated).
- Bulk string reply:
  - When using the `INCR` option, the command returns the new score of the member as a bulk string.

## Conclusion

The `ZADD` command is a powerful tool in maintaining sorted sets, allowing for a flexible and efficient way to store and update data in a ranked order. Its various options like `NX`, `XX`, `CH`, and `INCR` make it adaptable for different scenarios, whether you are updating scores in a leaderboard or managing priority queues.
