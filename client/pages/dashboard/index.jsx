import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Dashboard Main Area</h1>
      </div>
    </div>
  );
}
