---
title: SELECT
---

# SELECT

Selects the Redis database to use for subsequent commands.

## Syntax

```
SELECT index
```

## Parameters

- **index**: The index of the database to select. This is an integer representing the database number.

## Details

- **Available since:** 1.0.0
- **Time complexity:** O(1)
- **ACL categories:** `@admin`

Redis databases are indexed by numbers, with the default configuration having 16 databases (numbered from `0` to `15`). The `SELECT` command is used to switch between these databases.

## Examples

### Selecting a Database

To select a specific database:

```
SELECT 1
```

This command switches the current database to database `1`. All subsequent commands will operate on this selected database until a new `SELECT` command is issued or the connection is closed.

### Switching Back to the Default Database

To switch back to the default database (database `0`):

```
SELECT 0
```

This command will switch back to database `0`.

## RESP2/RESP3 Reply

- Simple string reply: `OK` if the database was successfully selected.

### Example Reply

```
"OK"
```

This indicates that the `SELECT` command was successful, and the selected database has been changed.

## Notes

- The `SELECT` command is used to choose which database to operate on, but it does not persist across connections. Each new connection defaults to database `0` unless a different database is selected.
- Database indices are zero-based, so valid indices are from `0` to `15` by default, depending on the `databases` configuration setting in the Redis server configuration file.
- Changing the database with `SELECT` affects only the current connection. Different connections can operate on different databases simultaneously.
