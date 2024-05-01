import Navbar from "@/components/v2/navbar";

const DashboardPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        <section className="container h-[400px] flex justify-center items-center">
          <h1 className="text-4xl">Welcome to Dashboard</h1>
        </section>
      </main>
    </>
  );
};

export default DashboardPage;
