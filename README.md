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
