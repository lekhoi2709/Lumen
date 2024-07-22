import Layout from "@/layouts/layout";
import UploadButton from "@/components/upload";

function Dashboard() {
  return (
    <Layout>
      <div className="w-full px-6">
        <h1>Dashboard</h1>
        <UploadButton />
      </div>
    </Layout>
  );
}

export default Dashboard;
