# NextGen Food Court

<!-- Day 1 – Database Infrastructure & Migrations -->

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

<!-- Outlet Authentication (Day 2 – Member 3) -->

This update implements outlet (vendor) authentication for the Food Court backend.

## features implemented

Outlet registration

Outlet login

Password hashing using bcrypt

JWT-based authentication

Outlet active status check on login

Clean project structure to avoid circular imports

## api endpoints
Register Outlet
POST /api/outlets/register


Body

{
  "name": "Outlet Name",
  "email": "outlet@email.com",
  "password": "password",
  "cuisine": "Cuisine Type"
}

Login Outlet
POST /api/outlets/login


Body

{
  "email": "outlet@email.com",
  "password": "password"
}

## Key Files

server/app.py – Flask app setup

server/extensions.py – Shared extensions (db, bcrypt, JWT)

server/models.py – Outlet model

server/routes/outlet_auth.py – Outlet auth routes

## testing

Endpoints tested using Postman / Thunder Client:

Successful registration

Successful login

Invalid credentials handling

Inactive outlet restriction

# scope

This work strictly covers Day 2 responsibilities:

Outlet registration and login only.