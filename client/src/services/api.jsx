const BASE_URL = "http://localhost:4000";

/**
 * MENU
 */

// Fetch all menu items
export async function fetchMenu() {
  const res = await fetch(`${BASE_URL}/menu`);
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();
  // normalize fields if needed
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    outlet: item.outlet
  }));
}

// Fetch single menu item by id
export async function fetchMenuItem(id) {
  const res = await fetch(`${BASE_URL}/menu/${id}`);
  if (!res.ok) throw new Error("Menu item not found");
  const item = await res.json();
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    image: item.image,
    category: item.category,
    outlet: item.outlet
  };
}

/**
 * AUTH
 */

// Fake login
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/users?email=${email}&password=${password}`);
  const users = await res.json();

  if (users.length === 0) {
    // Invalid credentials
    return { error: "Invalid credentials" };
  }

  const user = users[0];

  // Return a mock JWT token and user info
  return {
    token: "mock-jwt-token",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

// Fetch user profile
export async function fetchUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error("User not found");
  return res.json();
}

/**
 * CART
 */

// Get cart items for a user
export async function fetchCart(userId) {
  const res = await fetch(`${BASE_URL}/cart?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

// Add item to cart
export async function addToCart(userId, menuItem, quantity = 1) {
  const payload = {
    userId,
    menuId: menuItem.id,
    name: menuItem.name,
    price: menuItem.price,
    quantity
  };

  const res = await fetch(`${BASE_URL}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}
