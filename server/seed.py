from app import create_app
from faker import Faker
from random import randint, choice, uniform

from models import (
    db,
    Customer,
    Outlet,
    MenuItem,
    FoodCourtTable
)

app = create_app()
fake = Faker()


def seed_data():
    with app.app_context():
        print("Resetting database...")
        db.drop_all()
        db.create_all()

        # ----------------------------------------
        # Outlets
        # ----------------------------------------
        print("Seeding outlets...")
        cuisines = [
            "Kenyan",
            "Nigerian",
            "Ethiopian",
            "Congolese",
            "Indian",
            "Chinese",
            "Italian",
            "Mexican",
            "Other"
        ]

        outlets = []
        for _ in range(5):
            outlet = Outlet(
                owner_name=fake.name(),
                email=fake.unique.email(),
                password="password123",
                outlet_name=fake.company(),
                cuisine_type=choice(cuisines),
                description=fake.catch_phrase(),
                is_active=True
            )
            outlets.append(outlet)

        db.session.add_all(outlets)
        db.session.commit()

        # ----------------------------------------
        # Food Court Tables
        # ----------------------------------------
        print("Seeding food court tables...")
        tables = []
        # Assign 4 tables to each outlet
        for outlet in outlets:
            for i in range(1, 5):
                table = FoodCourtTable(
                    table_number=i,
                    capacity=choice([2, 4, 6]),
                    is_available=True,
                    outlet_id=outlet.id
                )
                tables.append(table)

        db.session.add_all(tables)
        db.session.commit()

        # ----------------------------------------
        # Menu Items
        # ----------------------------------------
        print("Seeding menu items...")
        categories = [
            "kids",
            "snack",
            "main",
            "appetizer",
            "dessert",
            "beverage",
            "other"
        ]

        menu_items = []
        for outlet in outlets:
            for _ in range(10):
                item = MenuItem(
                    item_name=f"{fake.word().capitalize()} {fake.word().capitalize()}",
                    outlet_id=outlet.id,
                    description=fake.sentence(),
                    price=round(uniform(5.0, 50.0), 2),
                    category=choice(categories),
                    image_url=fake.image_url(),
                    is_available=True,
                    preparation_time=randint(5, 40)
                )
                menu_items.append(item)

        db.session.add_all(menu_items)
        db.session.commit()

        # ----------------------------------------
        # Customers
        # ----------------------------------------
        print("Seeding customers...")
        customers = []
        for _ in range(10):
            customer = Customer(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.email(),
                password="password123",
                phone_number=f"07{randint(10000000, 99999999)}"
            )
            customers.append(customer)

        db.session.add_all(customers)
        db.session.commit()

        # ----------------------------------------
        # Password Hash Verification
        # ----------------------------------------
        print("Verifying password hashing...")

        customer = Customer.query.first()
        outlet = Outlet.query.first()

        if customer.password == "password123":
            print("ERROR: Customer password not hashed")
        else:
            print("Customer password hashed")

        if outlet.password == "password123":
            print("ERROR: Outlet password not hashed")
        else:
            print("Outlet password hashed")

        print("Seeding completed successfully!")


if __name__ == "__main__":
    seed_data()

