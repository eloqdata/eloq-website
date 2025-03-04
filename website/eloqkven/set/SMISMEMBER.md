---
title: SMISMEMBER
---

# SMISMEMBER

Returns a list of booleans indicating if each specified member is a member of the set stored at `key`.

## Syntax

```
SMISMEMBER key member [member ...]
```

## Details

- **Available since:** 6.2.0
- **Time complexity:** O(N) where N is the number of members being checked.
- **ACL categories:** `@read`, `@set`, `@fast`

## Example

Assume we have a set called `myset` with members "member1", "member2", and "member3":

```
SADD myset "member1" "member2"
```

Now, let's check if "member1", "member2", and "member4" are members of `myset`:

```
SMISMEMBER myset "member1" "member2" "member4"
```

This will output:

```
1) (integer) 1
2) (integer) 1
3) (integer) 0
```

## RESP2/RESP3 Reply

Array reply: list of integers representing the membership status of each member.
