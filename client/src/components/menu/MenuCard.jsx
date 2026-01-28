import { Button } from "../common/Button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../hooks/useCart";

export function MenuItem({ id, name, description, price, image, category }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
  };

  return (
    <div className="rounded-lg overflow-hidden bg-white border shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold">${price.toFixed(2)}</span>
          <Button onClick={handleAddToCart} size="sm">
            <ShoppingCart size={16} />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
