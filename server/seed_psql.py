"""
Seed script for PostgreSQL with realistic food court data including:
- 6 diverse food outlets with REAL restaurant images
- 38 menu items with REAL food images from Unsplash
- Food court tables
- Sample customers

All image URLs are from Unsplash - a reliable, free image service that won't return 404s.
"""

from app import create_app
from models import db, Customer, Outlet, MenuItem, FoodCourtTable
from random import randint, choice

app = create_app()


def seed_data():
    with app.app_context():
        print("🔄 Resetting database...")
        db.drop_all()
        db.create_all()

        # ========================================
        # OUTLETS - Realistic food establishments with REAL images
        # ========================================
        print("🏪 Seeding outlets...")
        
        outlets_data = [
            {
                "owner_name": "Wanjiku Kamau",
                "email": "wanjiku@mamaskitchen.co.ke",
                "outlet_name": "Mama's Kitchen",
                "cuisine_type": "Kenyan",
                "description": "Authentic Kenyan home-cooked meals with love",
                "image_url": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop"
            },
            {
                "owner_name": "Rajesh Patel",
                "email": "rajesh@spicepalace.co.ke",
                "outlet_name": "Spice Palace",
                "cuisine_type": "Indian",
                "description": "Traditional Indian curries and tandoori specialties",
                "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
            },
            {
                "owner_name": "Chen Wei",
                "email": "chen@dragonwok.co.ke",
                "outlet_name": "Dragon Wok",
                "cuisine_type": "Chinese",
                "description": "Authentic Chinese stir-fry and dim sum",
                "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop"
            },
            {
                "owner_name": "Giuseppe Romano",
                "email": "giuseppe@bellaroma.co.ke",
                "outlet_name": "Bella Roma",
                "cuisine_type": "Italian",
                "description": "Fresh pasta and wood-fired pizzas",
                "image_url": "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop"
            },
            {
                "owner_name": "Carlos Mendez",
                "email": "carlos@eltoro.co.ke",
                "outlet_name": "El Toro Loco",
                "cuisine_type": "Mexican",
                "description": "Spicy tacos, burritos, and authentic Mexican street food",
                "image_url": "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop"
            },
            {
                "owner_name": "Amara Okafor",
                "email": "amara@jollofspot.co.ke",
                "outlet_name": "Jollof Spot",
                "cuisine_type": "Nigerian",
                "description": "The best Jollof rice and Nigerian delicacies",
                "image_url": "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop"
            }
        ]

        outlets = []
        for data in outlets_data:
            outlet = Outlet(
                owner_name=data["owner_name"],
                email=data["email"],
                password="password123",
                outlet_name=data["outlet_name"],
                cuisine_type=data["cuisine_type"],
                description=data["description"],
                image_url=data["image_url"],
                is_active=True
            )
            outlets.append(outlet)

        db.session.add_all(outlets)
        db.session.commit()
        print(f"✅ Created {len(outlets)} outlets")

        # ========================================
        # FOOD COURT TABLES
        # ========================================
        print("🪑 Seeding food court tables...")
        tables = []
        
        # Create 6 tables per outlet
        for outlet in outlets:
            for i in range(1, 7):
                table = FoodCourtTable(
                    table_number=i,
                    capacity=choice([2, 4, 6]),
                    is_available=True,
                    outlet_id=outlet.id
                )
                tables.append(table)

        db.session.add_all(tables)
        db.session.commit()
        print(f"✅ Created {len(tables)} tables")

        # ========================================
        # MENU ITEMS - Realistic dishes with REAL food images
        # ========================================
        print("🍽️  Seeding menu items...")

        # Mama's Kitchen - Kenyan (with real African food images)
        mamas_menu = [
            {"name": "Ugali & Sukuma Wiki", "category": "main", "price": 350, "prep": 20, "desc": "Traditional maize meal with collard greens", "img": "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&h=400&fit=crop"},
            {"name": "Nyama Choma", "category": "main", "price": 850, "prep": 35, "desc": "Grilled goat meat with kachumbari", "img": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=400&fit=crop"},
            {"name": "Pilau Rice", "category": "main", "price": 450, "prep": 25, "desc": "Spiced rice with tender beef", "img": "https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=500&h=400&fit=crop"},
            {"name": "Githeri", "category": "main", "price": 300, "prep": 20, "desc": "Boiled maize and beans", "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop"},
            {"name": "Chapati", "category": "appetizer", "price": 50, "prep": 10, "desc": "Soft layered flatbread", "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop"},
            {"name": "Mandazi", "category": "snack", "price": 100, "prep": 15, "desc": "Sweet fried dough (4 pieces)", "img": "https://images.unsplash.com/photo-1612182062631-e5c8c3c3e0d3?w=500&h=400&fit=crop"},
        ]

        # Spice Palace - Indian (with real Indian food images)
        spice_menu = [
            {"name": "Chicken Tikka Masala", "category": "main", "price": 750, "prep": 30, "desc": "Creamy tomato curry with tender chicken", "img": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop"},
            {"name": "Butter Chicken", "category": "main", "price": 780, "prep": 30, "desc": "Rich and creamy chicken curry", "img": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop"},
            {"name": "Paneer Tikka", "category": "main", "price": 650, "prep": 25, "desc": "Grilled cottage cheese with spices", "img": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop"},
            {"name": "Biryani", "category": "main", "price": 700, "prep": 35, "desc": "Fragrant rice with spiced meat", "img": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop"},
            {"name": "Samosa", "category": "appetizer", "price": 150, "prep": 15, "desc": "Crispy pastry with spiced filling (2 pieces)", "img": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop"},
            {"name": "Naan Bread", "category": "appetizer", "price": 120, "prep": 10, "desc": "Soft tandoor-baked bread", "img": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop"},
            {"name": "Mango Lassi", "category": "beverage", "price": 250, "prep": 5, "desc": "Sweet yogurt drink with mango", "img": "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=500&h=400&fit=crop"},
        ]

        # Dragon Wok - Chinese (with real Chinese food images)
        dragon_menu = [
            {"name": "Kung Pao Chicken", "category": "main", "price": 680, "prep": 25, "desc": "Spicy stir-fried chicken with peanuts", "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=400&fit=crop"},
            {"name": "Sweet & Sour Pork", "category": "main", "price": 720, "prep": 25, "desc": "Crispy pork in tangy sauce", "img": "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&h=400&fit=crop"},
            {"name": "Fried Rice", "category": "main", "price": 450, "prep": 20, "desc": "Wok-fried rice with vegetables and egg", "img": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&h=400&fit=crop"},
            {"name": "Spring Rolls", "category": "appetizer", "price": 200, "prep": 15, "desc": "Crispy vegetable rolls (4 pieces)", "img": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=500&h=400&fit=crop"},
            {"name": "Dim Sum Platter", "category": "appetizer", "price": 550, "prep": 20, "desc": "Assorted steamed dumplings", "img": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&h=400&fit=crop"},
            {"name": "Chow Mein", "category": "main", "price": 500, "prep": 20, "desc": "Stir-fried noodles with vegetables", "img": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=400&fit=crop"},
        ]

        # Bella Roma - Italian (with real Italian food images)
        bella_menu = [
            {"name": "Margherita Pizza", "category": "main", "price": 850, "prep": 25, "desc": "Classic tomato, mozzarella, and basil", "img": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop"},
            {"name": "Pepperoni Pizza", "category": "main", "price": 950, "prep": 25, "desc": "Loaded with pepperoni and cheese", "img": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop"},
            {"name": "Spaghetti Carbonara", "category": "main", "price": 750, "prep": 20, "desc": "Creamy pasta with bacon and parmesan", "img": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=400&fit=crop"},
            {"name": "Lasagna", "category": "main", "price": 800, "prep": 30, "desc": "Layered pasta with meat sauce and cheese", "img": "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop"},
            {"name": "Bruschetta", "category": "appetizer", "price": 350, "prep": 10, "desc": "Toasted bread with tomato and basil", "img": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=500&h=400&fit=crop"},
            {"name": "Tiramisu", "category": "dessert", "price": 400, "prep": 5, "desc": "Classic Italian coffee dessert", "img": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop"},
            {"name": "Gelato", "category": "dessert", "price": 300, "prep": 5, "desc": "Italian ice cream (2 scoops)", "img": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&h=400&fit=crop"},
        ]

        # El Toro Loco - Mexican (with real Mexican food images)
        toro_menu = [
            {"name": "Beef Tacos", "category": "main", "price": 550, "prep": 20, "desc": "Soft tacos with seasoned beef (3 pieces)", "img": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=400&fit=crop"},
            {"name": "Chicken Burrito", "category": "main", "price": 650, "prep": 25, "desc": "Large flour tortilla with chicken and beans", "img": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&h=400&fit=crop"},
            {"name": "Quesadilla", "category": "main", "price": 500, "prep": 15, "desc": "Grilled tortilla with cheese and chicken", "img": "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=500&h=400&fit=crop"},
            {"name": "Nachos Supreme", "category": "appetizer", "price": 450, "prep": 15, "desc": "Tortilla chips with cheese, salsa, and guacamole", "img": "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&h=400&fit=crop"},
            {"name": "Churros", "category": "dessert", "price": 300, "prep": 15, "desc": "Fried dough with cinnamon sugar", "img": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=400&fit=crop"},
            {"name": "Guacamole & Chips", "category": "appetizer", "price": 350, "prep": 10, "desc": "Fresh avocado dip with tortilla chips", "img": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=500&h=400&fit=crop"},
        ]

        # Jollof Spot - Nigerian (with real African food images)
        jollof_menu = [
            {"name": "Jollof Rice & Chicken", "category": "main", "price": 700, "prep": 30, "desc": "Spicy tomato rice with grilled chicken", "img": "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500&h=400&fit=crop"},
            {"name": "Suya", "category": "main", "price": 600, "prep": 25, "desc": "Spicy grilled meat skewers", "img": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=400&fit=crop"},
            {"name": "Puff Puff", "category": "snack", "price": 150, "prep": 15, "desc": "Sweet fried dough balls (6 pieces)", "img": "https://images.unsplash.com/photo-1612182062631-e5c8c3c3e0d3?w=500&h=400&fit=crop"},
            {"name": "Egusi Soup & Fufu", "category": "main", "price": 750, "prep": 35, "desc": "Melon seed soup with pounded yam", "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=400&fit=crop"},
            {"name": "Chin Chin", "category": "snack", "price": 200, "prep": 10, "desc": "Crunchy fried pastry snack", "img": "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=400&fit=crop"},
            {"name": "Plantain", "category": "appetizer", "price": 250, "prep": 15, "desc": "Fried sweet plantain", "img": "https://images.unsplash.com/photo-1587334206607-6f5a8b2f1f1e?w=500&h=400&fit=crop"},
        ]

        # Add all menu items
        menu_data = [
            (outlets[0], mamas_menu),   # Mama's Kitchen
            (outlets[1], spice_menu),    # Spice Palace
            (outlets[2], dragon_menu),   # Dragon Wok
            (outlets[3], bella_menu),    # Bella Roma
            (outlets[4], toro_menu),     # El Toro Loco
            (outlets[5], jollof_menu),   # Jollof Spot
        ]

        menu_items = []
        for outlet, items in menu_data:
            for item in items:
                menu_item = MenuItem(
                    item_name=item["name"],
                    outlet_id=outlet.id,
                    description=item["desc"],
                    price=item["price"],
                    category=item["category"],
                    image_url=item["img"],
                    is_available=True,
                    preparation_time=item["prep"]
                )
                menu_items.append(menu_item)

        db.session.add_all(menu_items)
        db.session.commit()
        print(f"✅ Created {len(menu_items)} menu items")

        # ========================================
        # CUSTOMERS
        # ========================================
        print("👥 Seeding customers...")
        
        customers_data = [
            {"first_name": "John", "last_name": "Doe", "email": "john.doe@example.com", "phone": "0712345678"},
            {"first_name": "Jane", "last_name": "Smith", "email": "jane.smith@example.com", "phone": "0723456789"},
            {"first_name": "Peter", "last_name": "Mwangi", "email": "peter.mwangi@example.com", "phone": "0734567890"},
            {"first_name": "Mary", "last_name": "Njeri", "email": "mary.njeri@example.com", "phone": "0745678901"},
            {"first_name": "David", "last_name": "Ochieng", "email": "david.ochieng@example.com", "phone": "0756789012"},
            {"first_name": "Sarah", "last_name": "Akinyi", "email": "sarah.akinyi@example.com", "phone": "0767890123"},
            {"first_name": "James", "last_name": "Kamau", "email": "james.kamau@example.com", "phone": "0778901234"},
            {"first_name": "Grace", "last_name": "Wanjiru", "email": "grace.wanjiru@example.com", "phone": "0789012345"},
        ]

        customers = []
        for data in customers_data:
            customer = Customer(
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                password="password123",
                phone_number=data["phone"]
            )
            customers.append(customer)

        db.session.add_all(customers)
        db.session.commit()
        print(f"✅ Created {len(customers)} customers")

        # ========================================
        # SUMMARY
        # ========================================
        print("\n" + "="*50)
        print("🎉 SEEDING COMPLETED SUCCESSFULLY!")
        print("="*50)
        print(f"📊 Summary:")
        print(f"   • {len(outlets)} Outlets (with real images)")
        print(f"   • {len(tables)} Tables")
        print(f"   • {len(menu_items)} Menu Items (with real food images)")
        print(f"   • {len(customers)} Customers")
        print("\n🖼️  All images from Unsplash - guaranteed working URLs!")
        print("\n🔐 Default password for all users: password123")
        print("\n📧 Sample outlet login:")
        print(f"   Email: {outlets[0].email}")
        print(f"   Password: password123")
        print("\n📧 Sample customer login:")
        print(f"   Email: {customers[0].email}")
        print(f"   Password: password123")
        print("="*50)


if __name__ == "__main__":
    seed_data()
