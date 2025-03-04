---
title: SISMEMBER
---

# SISMEMBER

Returns if `member` is a member of the set stored at `key`.

## Syntax

```
SISMEMBER key member
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

Now, let's check if "member1" is a member of `myset`:

```
SISMEMBER myset "member1"
```

This will output:

```
(integer) 1
```

Now, let's check if "member4" is a member of `myset`:

```
SISMEMBER myset "member4"
```

This will output:

```
(integer) 0
```

## RESP2/RESP3 Reply

Integer reply: `1` if the member is a member of the set, `0` if the member is not a member of the set or if `key` does not exist.
