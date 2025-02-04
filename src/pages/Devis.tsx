import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for demonstration
const mockDevis = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  client: `Client ${String.fromCharCode(65 + (i % 26))}`,
  date: new Date(2024, 0, i + 1).toLocaleDateString("fr-FR"),
  montant: Math.floor(Math.random() * 10000) + 1000,
  statut: ["En attente", "Accepté", "Refusé"][Math.floor(Math.random() * 3)],
}));

const ITEMS_PER_PAGE = 10;

const Devis = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  const totalPages = Math.ceil(mockDevis.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDevis = mockDevis.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Accepté":
        return "bg-green-100 text-green-800";
      case "Refusé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Devis</h1>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDevis.map((devis) => (
                  <TableRow key={devis.id}>
                    <TableCell>{devis.client}</TableCell>
                    <TableCell>{devis.date}</TableCell>
                    <TableCell>{devis.montant.toLocaleString('fr-FR')} €</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(devis.statut)}`}>
                        {devis.statut}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p => Math.max(1, p - 1));
                      }}
                      aria-disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Devis;