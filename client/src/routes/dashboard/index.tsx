import Layout from "@/layouts/layout";
import UploadButton from "@/components/upload";
function Dashboard() {
  return (
    <Layout>
      <div className="w-full p-4 md:pl-[16rem] relative z-0">
        <h1 className="text-xl w-fit h-12 content-center font-bold">
          Dashboard
        </h1>
        <UploadButton />
      </div>
    </Layout>
  );
}

export default Dashboard;