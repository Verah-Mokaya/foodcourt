# NextGen Food Court

Day 1 – Database Infrastructure & Migrations

## Contributor: Member 3
Feature Branch: feature/database-infrastructure

## Overview

Set up the PostgreSQL database infrastructure and configured Flask-Migrate to enable version-controlled schema management for the backend application.

## Tasks Completed

Configured PostgreSQL database connection

Integrated Flask-SQLAlchemy and Flask-Migrate

Initialized database migrations

Created initial database schema

Applied migrations to the PostgreSQL database

Verified successful schema creation using Alembic version tracking

## Outcome

The backend now supports controlled database schema evolution using migrations, providing a stable foundation for further backend feature development.

## Verification

The following tables were successfully created via migrations:

alembic_version

outlets

## Commands Used
flask db init
flask db migrate -m "Initial database schema"
flask db upgrade

## What changed
- Switched JWT authentication to use HttpOnly cookies instead of returning tokens in JSON
- Configured Flask-JWT-Extended to read tokens from cookies only
- Updated login routes to set JWT cookies on successful authentication
- Updated logout route to properly clear JWT cookies
- Fixed CORS configuration to support credentials (cookies)

## Why
- Prevents JWT access from browser JavaScript (mitigates XSS attacks)
- Aligns authentication flow with production-ready security best practices
- Simplifies frontend auth handling by relying on cookies

## How to test
1. Login as customer or outlet
2. Verify no JWT is returned in the response body
3. Call a protected route (e.g. `/auth/me`) with credentials enabled
4. Confirm request succeeds while token is not accessible in the browser
5. Logout and verify protected routes are no longer accessible

## Notes
- `JWT_COOKIE_SECURE` is set to `False` for local development
- Must be set to `True` in production (HTTPS)