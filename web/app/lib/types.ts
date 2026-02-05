export type User = {
    id: number | string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: "customer" | "admin" | "owner" | "outlet";
    outletId?: number | string;
    outlet_name?: string;
    owner_name?: string;
    name?: string;
    phone_number?: string;
    password?: string;
};

export type MenuItem = {
    id: number | string;
    outlet_id: number | string;
    item_name: string;
    price: number;
    category: string;
    image_url: string;
    is_available: boolean;
    description?: string;
};

export type Outlet = {
    id: number | string;
    outlet_name: string;
    cuisine_type: string;
    description: string;
    owner_id: number | string;
    image_url?: string;
    is_active?: boolean;
};
export type CartItem = {
    menuItemId: number | string;
    name: string;
    price: number;
    quantity: number;
    outletId: number | string;
    outletName: string;
};
export type OrderItem = {
    menu_item_id: number | string;
    item_name?: string;
    quantity: number;
    price: number;
};
export type Order = {
    id: number | string;
    customer_id: number | string;
    outlet_id: number | string;
    total_amount: number;
    status: "pending" | "preparing" | "ready" | "completed" | "cancelled";
    created_at: string;
    order_items: OrderItem[];
    payment_info?: any;
};
export type Table = {
    id: number | string;
    table_number: number;
    capacity: number;
    is_available: boolean;
};