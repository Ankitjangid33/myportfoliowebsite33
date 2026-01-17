# Database Migration Scripts

This folder contains scripts for migrating the portfolio database structure.

## Migration Overview

The migration separates the `about` data from the user document into its own collection and renames the `users` collection to `admin`.

### Before Migration

- Collection: `users`
- Structure: User document with embedded `about` object

### After Migration

- Collection: `admin` (renamed from `users`)
- Collection: `abouts` (new, separate collection)
- Structure: User data and about data are now in separate collections

## Available Scripts

### 1. `npm run migrate`

Migrates data from the old structure to the new structure:

- Copies `about` data from user document to new `abouts` collection
- Copies user data to new `admin` collection
- Keeps the old `users` collection intact for safety

### 2. `npm run cleanup`

Cleans up old data after verifying migration:

- Drops the old `users` collection
- Removes any remaining `about` fields from admin documents

### 3. `npm run verify-migration`

Verifies the migration was successful:

- Lists all collections
- Shows document counts
- Checks for the presence/absence of expected fields
- Confirms old collection is removed

## Migration Steps (Already Completed)

1. ✅ Created new `About` model
2. ✅ Updated `User` model (removed `about` field, renamed collection to `admin`)
3. ✅ Updated API routes to use new `About` model
4. ✅ Ran migration script
5. ✅ Ran cleanup script
6. ✅ Verified migration

## Current Database Structure

```
MongoDB Collections:
├── admin (1 document)
│   ├── email
│   ├── password
│   ├── name
│   ├── role
│   ├── profile
│   ├── lastPasswordChange
│   └── lastEmailChange
│
├── abouts (1 document)
│   ├── bio
│   ├── title
│   ├── skills
│   ├── experience
│   ├── education
│   ├── displayName
│   ├── initials
│   └── profileImage
│
├── contacts
├── notifications
└── projects
```

## Notes

- The migration is idempotent - you can run it multiple times safely
- Always verify with `npm run verify-migration` before running cleanup
- The old `users` collection has been removed
