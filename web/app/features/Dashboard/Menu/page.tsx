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