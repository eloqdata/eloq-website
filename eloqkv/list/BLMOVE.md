---
title: BLMOVE
---

# BLMOVE

Atomically pops an element from one list and pushes it to another list, with blocking support.

## Syntax

```
BLMOVE source destination where where timeout
```

## Parameters

- **source**: The key of the list from which the element will be removed.
- **destination**: The key of the list to which the element will be added.
- **where**: Specifies the direction to pop from the `source` list. Can be `LEFT` or `RIGHT`.
- **where**: Specifies the direction to push to the `destination` list. Can be `LEFT` or `RIGHT`.
- **timeout**: The maximum time in seconds to block waiting for an element to be available. If set to `0`, the command will return immediately if no element is available.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(1) for each pop and push operation. The blocking time complexity depends on the `timeout` value.
- **ACL categories:** `@read`, `@write`, `@list`, `@slow`

The `BLMOVE` command atomically moves an element from one list to another while supporting blocking behavior. This is particularly useful for scenarios where you want to wait for an element to become available in a list before performing the move operation.

The command will block until an element becomes available in the `source` list or until the `timeout` expires. If an element is available, it is removed from the `source` list and added to the `destination` list according to the specified directions.

## Examples

### Basic Usage

Assume we have the following lists:

```
RPUSH mylist1 "a" "b" "c"
RPUSH mylist2 "x" "y"
```

To move an element from the end of `mylist1` to the beginning of `mylist2`:

```
BLMOVE mylist1 mylist2 RIGHT LEFT 0
```

After running this command:

- `mylist1` will contain: `a` `b`
- `mylist2` will contain: `c` `x` `y`

The returned value will be:

```
"c"
```

### Blocking Behavior

To block until an element is available in `mylist1` and move it to `mylist2`, with a timeout of 5 seconds:

```
BLMOVE mylist1 mylist2 RIGHT LEFT 5
```

If an element becomes available within 5 seconds, it will be moved from `mylist1` to `mylist2`. If no element becomes available within the timeout period, the command will return `nil`.

### Immediate Return

To return immediately if no element is available, use a `0` timeout:

```
BLMOVE mylist1 mylist2 RIGHT LEFT 0
```

If `mylist1` is empty, the command will return `nil`.

## Edge Cases

- If either `source` or `destination` does not exist, it will be treated as an empty list. If the `source` is empty or becomes empty, the command will block until an element becomes available or the timeout expires.
- If the `timeout` is set to a negative value, the command will return an error.

## RESP2/RESP3 Reply

- Bulk string reply: the element that was moved, or `nil` if no element was available within the timeout period.
