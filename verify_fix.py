from server.app import create_app
from server.models import Customer
from server.extensions import bcrypt

app = create_app()
with app.app_context():
    print("Starting verification...")
    # Test Hashing
    c = Customer(first_name="Test", last_name="User", email="test_verify@test.com", password="plaintext123")
    print(f"Password Hash: {c.password}")
    
    if c.password == "plaintext123":
        print("ERROR: Password is not hashed!")
    elif c.password.startswith("$2b$"):
        print("SUCCESS: Password is hashed correctly.")
    else:
        print(f"ERROR: Password format unexpected: {c.password}")

    # Test Authentication
    if c.authenticate("plaintext123"):
        print("SUCCESS: Authentication passed with correct password.")
    else:
        print("ERROR: Authentication failed with correct password.")

    if not c.authenticate("wrongpass"):
        print("SUCCESS: Authentication failed with wrong password.")
    else:
        print("ERROR: Authentication passed with wrong password.")
    
    print("Verification execution finished.")
