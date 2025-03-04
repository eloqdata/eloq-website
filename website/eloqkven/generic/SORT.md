---
title: SORT
---

# SORT

Sorts the elements of a list, set, or sorted set in a Redis database.

## Syntax

```
SORT key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]
```

## Parameters

- **key**: The key of the list, set, or sorted set to be sorted.
- **BY pattern** (optional): A pattern to sort the elements by the values of another key. This is used with `LIST` or `SET` data types.
- **LIMIT offset count** (optional): Limits the number of elements returned. `offset` is the starting index, and `count` is the maximum number of elements to return.
- **GET pattern [GET pattern ...]** (optional): Retrieves specific fields for each element. Multiple `GET` patterns can be used to fetch different fields.
- **ASC|DESC** (optional): Specifies the sort order. Use `ASC` for ascending order and `DESC` for descending order. Default is `ASC`.
- **ALPHA** (optional): Sorts elements as strings. By default, sorting is numerical if the elements are numbers.
- **STORE destination** (optional): Stores the sorted elements into a new key. This is useful for persisting the result.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(N\*log(N)), where N is the number of elements to sort.
- **ACL categories:** `@read`, `@write`

The `SORT` command is used to sort the elements of a list, set, or sorted set in Redis. The sorting can be based on the values of the elements or another key, and it supports various options for filtering and storing results.

## Examples

### Sorting a List

To sort a list in ascending order:

```
SORT mylist
```

Assuming `mylist` contains numerical values, this command will return the list sorted in ascending order.

### Sorting with Pattern

To sort elements based on another key:

```
SORT myset BY myotherkey:*
```

Here, `myset` is sorted based on the values associated with `myotherkey`.

### Sorting with Limit

To sort and limit the results:

```
SORT mylist LIMIT 0 10
```

This command sorts `mylist` and returns only the first 10 elements.

### Sorting with Field Retrieval

To sort and get specific fields:

```
SORT mylist GET mylist:* GET mylist:field2
```

This sorts `mylist` and retrieves two fields for each element: `mylist:*` and `mylist:field2`.

### Sorting and Storing Results

To sort and store results in a new key:

```
SORT mylist STORE sortedlist
```

This command sorts `mylist` and stores the result in `sortedlist`.

## RESP2/RESP3 Reply

- Array reply: The sorted elements or an array of elements based on the specified options.

### Example Reply

For `SORT mylist`, if the list contains `[3, 1, 2]`, the reply will be:

```
1) "1"
2) "2"
3) "3"
```

For sorting with `GET`, the reply will include the fetched fields.

## Notes

- The `SORT` command is powerful but can be expensive in terms of performance for large datasets. Use it judiciously in high-performance applications.
- The command operates on lists, sets, and sorted sets differently. Ensure that the key you are sorting is of the correct type.
- When using `STORE`, ensure the destination key does not already exist, as it will be overwritten.
