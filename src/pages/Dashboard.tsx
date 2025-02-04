import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, FileText, TrendingUp } from "lucide-react";

const data = [
  { name: "Jan", visitors: 400 },
  { name: "Fév", visitors: 300 },
  { name: "Mar", visitors: 600 },
  { name: "Avr", visitors: 800 },
  { name: "Mai", visitors: 700 },
];

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                src="/lovable-uploads/8249ba1e-6e2c-47d1-93d1-aca5dbd5ece4.png"
                alt="Elles Logo"
                className="h-8"
              />
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                  navigate("/login");
                }}
                className="text-gray-700 hover:text-gray-900"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">Visiteurs aujourd'hui</div>
                  <div className="text-2xl font-semibold text-gray-900">145</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">Devis en cours</div>
                  <div className="text-2xl font-semibold text-gray-900">12</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">Taux de conversion</div>
                  <div className="text-2xl font-semibold text-gray-900">8.5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Visiteurs par mois</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visitors" fill="#4C1D95" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;