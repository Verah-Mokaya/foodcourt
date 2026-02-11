from app import create_app
app = create_app()
from models import db, Customer, Outlet, MenuItem, Order, OrderItem, Reservation, FoodCourtTable
from seed_data import OUTLETS
from random import choice

# Realistic Kenyan customer data


def seed_data():
    with app.app_context():
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()

        # Seed Food Court Tables (20 tables with varied capacity)
        print("Seeding Food Court Tables...")
        tables = []
        capacities = [2, 2, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 6, 6, 8, 8, 8, 8]
        for i in range(1, 21):
            table = FoodCourtTable(
                table_number=i,
                capacity=capacities[i - 1]
            )
            tables.append(table)
        db.session.add_all(tables)
        db.session.commit()
        print(f"  Created {len(tables)} tables")

        # Seed Outlets and their Menu Items
        print("Seeding Outlets and Menu Items...")
        total_items = 0
        for outlet_data in OUTLETS:
            items = outlet_data.pop("items")
            outlet = Outlet(**outlet_data)
            db.session.add(outlet)
            db.session.flush()  # Get the outlet ID

            for item_tuple in items:
                name, description, price, category, image_url = item_tuple
                item = MenuItem(
                    item_name=name,
                    outlet_id=outlet.id,
                    description=description,
                    price=price,
                    category=category,
                    image_url=image_url,
                    is_available=True
                )
                db.session.add(item)
                total_items += 1

            # Restore items back to outlet_data for potential re-use
            outlet_data["items"] = items
            print(f"  Created outlet: {outlet_data['outlet_name']} ({outlet_data['cuisine_type']}) with {len(items)} items")

        db.session.commit()
        print(f"  Total: {len(OUTLETS)} outlets, {total_items} menu items")

        # Seed Customers
        print("Seeding Customers...")
        customers = []
        for cust_data in CUSTOMERS:
            customer = Customer(
                first_name=cust_data["first_name"],
                last_name=cust_data["last_name"],
                email=cust_data["email"],
                password="password123",
                phone_number=cust_data["phone_number"]
            )
            customers.append(customer)
        db.session.add_all(customers)
        db.session.commit()
        print(f"  Created {len(customers)} customers")

        # Verify password hashing
        print("\nVerifying password hashing...")
        c = Customer.query.first()
        print(f"  Customer password in DB: {c.password[:20]}...")
        if c.password == "password123":
            print("  ERROR: Customer password is not hashed!")
        else:
            print("  SUCCESS: Customer password is hashed.")

        o = Outlet.query.first()
        print(f"  Outlet password in DB: {o.password[:20]}...")
        if o.password == "password123":
            print("  ERROR: Outlet password is not hashed!")
        else:
            print("  SUCCESS: Outlet password is hashed.")

        # Print summary
        print("\n" + "=" * 50)
        print("SEEDING SUMMARY")
        print("=" * 50)
        print(f"  Tables:     {FoodCourtTable.query.count()}")
        print(f"  Outlets:    {Outlet.query.count()}")
        print(f"  Menu Items: {MenuItem.query.count()}")
        print(f"  Customers:  {Customer.query.count()}")
        print("=" * 50)
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()