---
title: SCARD
---

# SCARD

Returns the cardinality (number of elements) of the set stored at `key`.

## Syntax

```
SCARD key
```

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@read`, `@set`, `@fast`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2" "member3"
```

Now, let's retrieve the cardinality of `myset`:

```
SCARD myset
```

This will output:

```
(integer) 3
```

## RESP2/RESP3 Reply

Integer reply: the cardinality of the set, or `0` if the key does not exist.
