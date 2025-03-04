---
title: HRANDFIELD
---

# HRANDFIELD

Returns a random field from the hash stored at `key`.

## Syntax

```
HRANDFIELD key [count]
```

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) where N is the number of fields in the hash.
- **ACL categories:** `@read`, `@hash`, `@fast`

## Example

Assume we have a hash called `myhash` with fields "field1", "field2", and "field3" with corresponding values:

```
HSET myhash field1 "value1"
HSET myhash field2 "value2"
HSET myhash field3 "value3"
```

Now, let's retrieve a random field from `myhash`:

```
HRANDFIELD myhash
```

This will output:

```
"field1"
```

Now, let's retrieve 2 random fields from `myhash`:

```
HRANDFIELD myhash 2
```

This might output something like:

```
1) "field3"
2) "field2"
```

## RESP2/RESP3 Reply

Bulk string reply: the random field(s) from the hash, or `nil` if the hash is empty.
