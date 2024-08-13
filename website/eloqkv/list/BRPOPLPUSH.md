---
title: BRPOPLPUSH
---

# BRPOPLPUSH

Atomically removes the last element from one list and pushes it to another list, with blocking support.

## Syntax

```
BRPOPLPUSH source destination timeout
```

## Parameters

- **source**: The key of the list from which the element will be removed.
- **destination**: The key of the list to which the element will be added.
- **timeout**: The maximum time in seconds to block waiting for an element to be available. If set to `0`, the command will block indefinitely until an element is available. If set to a positive number, the command will block for that number of seconds before returning `nil` if no element is available.

## Details

- **Available since:** 1.2.0
- **Time complexity:** O(1) for each pop and push operation. The blocking time complexity depends on the `timeout` value.
- **ACL categories:** `@read`, `@write`, `@list`, `@slow`

The `BRPOPLPUSH` command atomically removes the last element from the `source` list and pushes it to the `destination` list. The command supports blocking behavior, meaning it will wait until the `source` list contains at least one element or until the `timeout` expires.

If the `source` list is empty and the `timeout` expires, the command will return `nil`. If the `timeout` is set to `0`, the command will block indefinitely until an element becomes available in the `source` list.

## Examples

### Basic Usage

Assume we have the following lists:

```
RPUSH mylist1 "a" "b" "c"
RPUSH mylist2 "x" "y"
```

To atomically remove the last element from `mylist1` and push it to `mylist2`:

```
BRPOPLPUSH mylist1 mylist2 0
```

After running this command:

- `mylist1` will contain: `a` `b`
- `mylist2` will contain: `x` `y` `c`
- The returned value will be:

```
"c"
```

### Blocking Behavior

To block until an element becomes available in `mylist1` and move it to `mylist2`, with a timeout of 5 seconds:

```
BRPOPLPUSH mylist1 mylist2 5
```

If an element becomes available within 5 seconds, it will be removed from `mylist1` and added to `mylist2`. If no element becomes available within the timeout period, the command will return `nil`.

### Immediate Return

To return immediately if no element is available, use a `0` timeout:

```
BRPOPLPUSH mylist1 mylist2 0
```

If `mylist1` is empty, the command will return `nil` until an element is added or the process is terminated.

### Empty Source List

If `mylist1` is empty and you run:

```
BRPOPLPUSH mylist1 mylist2 10
```

The command will block for up to 10 seconds waiting for an element to be added to `mylist1`. If no element is added within that time, the command will return `nil`.

## Edge Cases

- If `timeout` is set to a negative value, the command will return an error.
- If the `source` list does not exist, it is treated as an empty list. If the `destination` list does not exist, it is created as an empty list before pushing the element.
- If the `source` list is empty and `timeout` expires, the command will return `nil`.

## RESP2/RESP3 Reply

- Bulk string reply: The element that was removed from the `source` list and pushed to the `destination` list. If no element is available within the `timeout` period, the reply is `nil`.
