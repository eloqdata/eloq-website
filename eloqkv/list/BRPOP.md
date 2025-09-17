---
title: BRPOP
---

# BRPOP

Removes and returns the last element of the list, or blocks until one is available.

## Syntax

```
BRPOP key [key ...] timeout
```

## Parameters

- **key**: One or more keys representing the lists from which elements will be removed. The command examines the lists in the order they are specified.
- **timeout**: The maximum time in seconds to block waiting for an element to be available. If set to `0`, the command will block indefinitely until an element is available. If set to a positive number, the command will block for that number of seconds before returning `nil` if no element is available.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1) for each pop operation. The blocking time complexity depends on the `timeout` value.
- **ACL categories:** `@read`, `@write`, `@list`, `@slow`

The `BRPOP` command removes and returns the last element from the last non-empty list among the specified keys. If none of the specified lists contain elements, the command blocks until an element becomes available or until the `timeout` expires. If the `timeout` is set to `0`, the command will block indefinitely.

The command returns a list with two elements:

1. The key of the list from which the element was removed.
2. The element itself.

## Examples

### Basic Usage

Assume we have the following lists:

```
RPUSH mylist1 "a" "b" "c"
RPUSH mylist2 "x" "y"
```

To remove and return the last element from the end of `mylist1`:

```
BRPOP mylist1
```

After running this command:

- `mylist1` will contain: `a` `b`
- The returned value will be:

```
1) "mylist1"
2) "c"
```

### Blocking Behavior

To block until an element becomes available in `mylist1` or `mylist2`, with a timeout of 5 seconds:

```
BRPOP mylist1 mylist2 5
```

If an element becomes available within 5 seconds, it will be removed from one of the lists and returned. If no element becomes available within the timeout period, the command will return `nil`.

### Immediate Return

To return immediately if no element is available, use a `0` timeout:

```
BRPOP mylist1 mylist2 0
```

If both `mylist1` and `mylist2` are empty, the command will return `nil`.

### Multiple Keys

To remove and return the last element from the end of multiple lists:

```
BRPOP mylist1 mylist2 mylist3 10
```

The command will examine all specified lists in the order they are listed and return the last element from the last non-empty list within 10 seconds.

## Edge Cases

- If `timeout` is set to a negative value, the command will return an error.
- If all specified lists are empty and the `timeout` expires, the command will return `nil`.

## RESP2/RESP3 Reply

- Array reply: A list containing two elements:
  1. The key of the list from which the element was removed.
  2. The removed element.
- If no element is available within the `timeout` period, the reply is `nil`.
