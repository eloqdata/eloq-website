---
title: BLMPOP
---

# BLMPOP

Removes and returns one or more elements from the head or tail of one or more lists, with blocking support.

## Syntax

```
BLMPOP timeout [LEFT|RIGHT] key [key ...]
```

## Parameters

- **timeout**: The maximum time in seconds to block waiting for an element to be available. If set to `0`, the command will return immediately if no element is available.
- **[LEFT|RIGHT]**: Specifies the direction to pop from the lists. Can be `LEFT` to pop from the head or `RIGHT` to pop from the tail.
- **key**: One or more keys representing the lists from which elements will be removed.

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(1) for each pop operation. The blocking time complexity depends on the `timeout` value.
- **ACL categories:** `@read`, `@write`, `@list`, `@slow`

The `BLMPOP` command atomically removes and returns one or more elements from the specified lists. The command supports blocking behavior, which means it will wait until at least one of the specified lists contains elements or until the `timeout` expires.

The command returns a list of the removed elements and their corresponding list keys. The lists are examined in the order they are specified, and the first list with available elements is chosen based on the specified direction (`LEFT` or `RIGHT`).

## Examples

### Basic Usage

Assume we have the following lists:

```
RPUSH mylist1 "a" "b" "c"
RPUSH mylist2 "x" "y"
```

To remove and return one element from the end of `mylist1`:

```
BLMPOP 0 RIGHT mylist1
```

After running this command:

- `mylist1` will contain: `a` `b`
- The returned value will be:

```
1) "mylist1"
2) "c"
```

### Blocking Behavior

To block until an element becomes available in `mylist1` or `mylist2` and remove it from the end of the lists, with a timeout of 5 seconds:

```
BLMPOP 5 RIGHT mylist1 mylist2
```

If an element becomes available within 5 seconds, it will be removed from one of the lists. If no element becomes available within the timeout period, the command will return `nil`.

### Immediate Return

To return immediately if no element is available, use a `0` timeout:

```
BLMPOP 0 RIGHT mylist1 mylist2
```

If both `mylist1` and `mylist2` are empty, the command will return `nil`.

### Multiple Keys

To remove and return one element from the end of multiple lists, `mylist1` and `mylist2`, with a timeout of 10 seconds:

```
BLMPOP 10 RIGHT mylist1 mylist2
```

The command will examine both lists and return the first available element from the end of either list within 10 seconds.

## Edge Cases

- If none of the specified lists have elements available, the command will block until an element becomes available or the timeout expires.
- If `timeout` is set to a negative value, the command will return an error.

## RESP2/RESP3 Reply

- Array reply: A list containing the removed element and the key of the list from which it was removed. If no element is available within the timeout period, the reply is `nil`.
