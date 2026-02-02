export type User = {
    id: number | string;
    email: string;
    first_name?: string;
    last_name?: string;
    role: "customer" | "admin" | "owner" | "outlet";
    outletId?: number | string; // specific for owner/outlet role
    name?: string; // helper
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