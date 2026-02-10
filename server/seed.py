from app import app
from models import db, Customer, Outlet, MenuItem, Order, OrderItem, Reservation, FoodCourtTable
from faker import Faker
from random import randint, choice, uniform

fake = Faker()

def seed_data():
    with app.app_context():
        print("Clearing existing data...")
        db.drop_all()
        db.create_all()

        print("Seeding Food Court Tables...")
        tables = []
        for i in range(1, 21):
            table = FoodCourtTable(
                table_number=i,
                capacity=choice([2, 4, 6, 8])
            )
            tables.append(table)
        db.session.add_all(tables)
        db.session.commit()

        print("Seeding Outlets...")
        cuisines = ["Ethiopian", "Nigerian", "Congolese", "Kenyan", "Indian", "Chinese", "Italian", "Mexican", "Other"]
        outlets = []
        for _ in range(5):
            outlet = Outlet(
                owner_name=fake.name(),
                email=fake.email(),
                outlet_name=fake.company(),
                cuisine_type=choice(cuisines),
                description=fake.catch_phrase(),
                password="password123" 
            )
            outlets.append(outlet)
        db.session.add_all(outlets)
        db.session.commit()

        print("Seeding Menu Items...")
        categories = ["kids", "snack", "main", "appetizer", "dessert", "beverage", "other"]
        for outlet in outlets:
            for _ in range(10):
                item = MenuItem(
                    item_name=fake.word().capitalize() + " " + fake.word().capitalize(),
                    outlet_id=outlet.id,
                    description=fake.sentence(),
                    price=round(uniform(5.0, 50.0), 2),
                    category=choice(categories),
                    image_url=fake.image_url(),
                    is_available=True
                )
                db.session.add(item)
        db.session.commit()

        print("Seeding Customers...")
        customers = []
        for _ in range(10):
            customer = Customer(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password="password123",
                phone_number=f"07{randint(10000000, 99999999)}"
            )
            customers.append(customer)
        db.session.add_all(customers)
        db.session.commit()
        
        # Verify hashing
        print("Verifying hashing...")
        c = Customer.query.first()
        print(f"Customer password in DB: {c.password}")
        if c.password == "password123":
             print("ERROR: Password is not hashed!")
        else:
             print("SUCCESS: Password is hashed.")
             
        o = Outlet.query.first()
        print(f"Outlet password in DB: {o.password}")
        if o.password == "password123":
             print("ERROR: Outlet password is not hashed!")
        else:
             print("SUCCESS: Outlet password is hashed.")

        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_data()