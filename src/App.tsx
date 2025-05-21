
import AppProviders from "@/providers/AppProviders";
import MainLayout from "@/layouts/MainLayout";
import AppRoutes from "@/routes/AppRoutes";

const App = () => {
  // Set document title for better SEO
  document.title = "Master Tools BD - Premium Learning Platform Access";
  
  return (
    <AppProviders>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AppProviders>
  );
};

export default App;
