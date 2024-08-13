---
title: RPOPLPUSH
---

# RPOPLPUSH

Removes the last element from a list and adds it to the beginning of another list.

## Syntax

```
RPOPLPUSH source destination
```

## Parameters

- **source**: The key of the list from which the element will be removed.
- **destination**: The key of the list to which the element will be added.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@write`, `@list`, `@fast`

The `RPOPLPUSH` command performs a combination of two operations:

1. Removes the last element from the `source` list.
2. Adds the removed element to the beginning of the `destination` list.

If `source` does not exist or is empty, the command returns `nil` and no changes are made. If `destination` does not exist, it is created as an empty list before the element is added.

## Examples

### Basic Usage

Assume we have the following lists:

```
RPUSH mylist1 "a" "b" "c"
RPUSH mylist2 "x" "y"
```

To move the last element from `mylist1` to the beginning of `mylist2`:

```
RPOPLPUSH mylist1 mylist2
```

After running this command:

- `mylist1` will contain: `a` `b`
- `mylist2` will contain: `c` `x` `y`

The returned value will be:

```
"c"
```

### Source List is Empty

If `mylist1` was already empty:

```
RPOPLPUSH mylist1 mylist2
```

The command will return:

```
(nil)
```

And `mylist2` will remain unchanged.

### Destination List Does Not Exist

If `mylist2` did not exist before:

```
RPOPLPUSH mylist1 mylist2
```

`mylist2` will be created and will contain the element that was removed from `mylist1`.

## Edge Cases

- If `source` does not exist or is empty, `RPOPLPUSH` will return `nil` and no changes will be made to `destination`.
- If `destination` is the same as `source`, the element will be removed from the end of the list and added to the beginning of the same list.

## RESP2/RESP3 Reply

- Bulk string reply: the element that was removed from the `source` list and added to the `destination` list. If the `source` list is empty or does not exist, the reply is `nil`.
