const [menu, setMenu] = useState([]);

useEffect(() => {
  fetchMenu().then(setMenu);
}, []);

return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {menu.map(item => (
      <MenuItem key={item.id} {...item} />
    ))}
  </div>
);
if (loading) {
  return <p className="text-center mt-10">Loading menu...</p>;
}

if (!menu.length) {
  return <p className="text-center mt-10">No menu items available</p>;
}
