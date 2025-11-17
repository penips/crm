<!-- 2382991e-0539-4615-acac-7dbb1e5c3c7e 1fcc0ddf-f1b2-4ee2-83f7-4df7c7ba112b -->
# Contact-Focused CRM Implementation

## Overview

Build a contact-focused CRM system with contacts management, company relationships, and a clean UI for viewing, creating, and editing contacts.

## Database Schema

### 1. Contacts Table (`src/server/db/schema.ts`)

Add a `contacts` table with fields:

- `id` (text, primary key)
- `firstName`, `lastName` (text)
- `email` (text, unique, optional)
- `phone` (text, optional)
- `company` (text, optional) - company name
- `jobTitle` (text, optional)
- `notes` (text, optional)
- `tags` (text array, optional) - for categorization
- `createdById` (text, references user.id)
- `createdAt`, `updatedAt` (timestamps)

### 2. Companies Table (optional, for future expansion)

Add a `companies` table with:

- `id` (text, primary key)
- `name` (text, unique)
- `website` (text, optional)
- `industry` (text, optional)
- `createdById` (text, references user.id)
- `createdAt`, `updatedAt` (timestamps)

Add relations between contacts and companies.

## Backend API

### 3. Contact Router (`src/server/api/routers/contact.ts`)

Create tRPC router with procedures:

- `getAll` - List all contacts (with pagination, search, filter)
- `getById` - Get single contact by ID
- `create` - Create new contact
- `update` - Update existing contact
- `delete` - Delete contact
- `search` - Search contacts by name, email, company

### 4. Update API Root (`src/server/api/root.ts`)

Add `contact` router to the main router.

## Frontend UI

### 5. Contacts List Page (`src/app/contacts/page.tsx`)

- Display table/list of contacts
- Search bar
- Filter by tags/company
- "Add Contact" button
- Link to contact detail pages

### 6. Contact Detail Page (`src/app/contacts/[id]/page.tsx`)

- View full contact information
- Edit button
- Delete button
- Display all contact fields

### 7. Contact Form Component (`src/app/contacts/_components/contact-form.tsx`)

- Reusable form for create/edit
- Fields: firstName, lastName, email, phone, company, jobTitle, notes, tags
- Validation with Zod
- Submit via tRPC mutation

### 8. Contact List Component (`src/app/contacts/_components/contact-list.tsx`)

- Table/card view of contacts
- Search and filter UI
- Click to navigate to detail page

### 9. Navigation/Layout Updates

- Add navigation bar with "Contacts" link
- Update main page to redirect to contacts or show dashboard
- Update metadata/title

## Cleanup

### 10. Remove Example Code

- Remove `posts` table from schema (or keep if needed)
- Remove `postRouter` from API root
- Clean up example post components

## Implementation Order

1. Database schema (contacts table)
2. tRPC contact router
3. Contact list page and components
4. Contact detail page
5. Contact form (create/edit)
6. Navigation and layout updates
7. Cleanup example code

### To-dos

- [ ] Add contacts table to database schema with all required fields (firstName, lastName, email, phone, company, jobTitle, notes, tags, timestamps)
- [ ] Add companies table to schema (optional, for future expansion) with relations to contacts
- [ ] Create contact tRPC router with getAll, getById, create, update, delete, and search procedures
- [ ] Add contact router to main API root router
- [ ] Create contacts list page (/contacts) with table view and search functionality
- [ ] Create reusable contact list component with search and filter UI
- [ ] Create contact detail page (/contacts/[id]) to view full contact information
- [ ] Create reusable contact form component for create/edit with validation
- [ ] Add navigation bar and update layout with Contacts link, update main page
- [ ] Remove or clean up example posts code from schema and routers