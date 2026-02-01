// import React from "react";

// export default function MenuCard({ item }) {
//   return (
//     <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-200">
//       <img
//         src={item.image}
//         alt={item.name}
//         className="w-full h-48 object-cover"
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
//         <p className="text-gray-600 mt-1">{item.description}</p>
//         <div className="mt-3 flex justify-between items-center">
//           <span className="font-semibold text-green-600">${item.price}</span>
//           <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React from "react";

export default function MenuCard({ item, onAddToCart }) {
  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
      {/* Image container with overlay effect */}
      <div className="relative overflow-hidden h-56">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Price badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
          <span className="font-bold text-green-600 text-lg">${item.price}</span>
        </div>
        {/* Category badge */}
        {item.category && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {item.category}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">{item.name}</h3>
          {/* Rating */}
          {item.rating && (
            <div className="flex items-center mt-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">{item.rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
        
        <div className="flex justify-between items-center">
          {/* Quick actions */}
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          
          <button
            onClick={() => onAddToCart && onAddToCart(item)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
