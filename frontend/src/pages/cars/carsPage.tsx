import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../../components/carCard";
import { Button } from "../../components/ui/button";
import api from "../../lib/api";
import { Car, Search, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";

interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  etat: string;
  prixJour: number;
  image?: string;
  createdAt: string;
}

function CarsPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [marques, setMarques] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [marqueFilter, setMarqueFilter] = useState<string>("all");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch marques on mount
  useEffect(() => {
    fetchMarques();
  }, []);

  // Fetch vehicles when filters change
  useEffect(() => {
    fetchVehicles();
  }, [debouncedSearchTerm, statusFilter, marqueFilter]);

  const fetchMarques = async () => {
    try {
      const response = await api.get("/vehicles/marques/all");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setMarques(data);
    } catch (error) {
      console.error("Error fetching marques:", error);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", "1");
      params.append("limit", "100");

      if (debouncedSearchTerm) {
        params.append("search", debouncedSearchTerm);
      }

      if (statusFilter !== "all") {
        params.append("etat", statusFilter);
      }

      if (marqueFilter !== "all") {
        params.append("marque", marqueFilter);
      }

      const response = await api.get(`/vehicles?${params.toString()}`);

      // Handle both array and object responses
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Impossible de charger les véhicules");
      setVehicles([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = (id: number) => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.info("Veuillez vous connecter pour réserver");
      navigate("/login");
      return;
    }
    navigate(`/car/${id}`);
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header Section */}
      <section className="bg-black text-white py-12 px-4">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Retour à l'accueil
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tous nos véhicules
            </h1>
            <p className="text-xl text-gray-300">
              Explorez notre flotte complète et trouvez le véhicule parfait pour
              votre prochain voyage
            </p>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Filters Card */}
          <div className="mb-8 p-6 bg-card border rounded-lg shadow-sm">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative w-full max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Rechercher par marque, modèle ou immatriculation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
                {loading && searchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Filter Section */}
            <div className="space-y-4">
              {/* Marque Filter */}
              {marques.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Marque
                    </h3>
                    {marqueFilter !== "all" && (
                      <button
                        onClick={() => setMarqueFilter("all")}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant={marqueFilter === "all" ? "default" : "outline"}
                      className="cursor-pointer px-4 py-1.5"
                      onClick={() => setMarqueFilter("all")}
                    >
                      Toutes
                    </Badge>
                    {marques.map((marque) => (
                      <Badge
                        key={marque}
                        variant={
                          marqueFilter === marque ? "default" : "outline"
                        }
                        className="cursor-pointer px-4 py-1.5"
                        onClick={() => setMarqueFilter(marque)}
                      >
                        {marque}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {marques.length > 0 && <div className="border-t"></div>}

              {/* Status Filter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Statut
                  </h3>
                  {statusFilter !== "all" && (
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge
                    variant={statusFilter === "all" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-1.5"
                    onClick={() => setStatusFilter("all")}
                  >
                    Tous
                  </Badge>
                  <Badge
                    variant={
                      statusFilter === "Disponible" ? "default" : "outline"
                    }
                    className="cursor-pointer px-4 py-1.5"
                    onClick={() => setStatusFilter("Disponible")}
                  >
                    Disponible
                  </Badge>
                  <Badge
                    variant={
                      statusFilter === "En maintenance" ? "default" : "outline"
                    }
                    className="cursor-pointer px-4 py-1.5"
                    onClick={() => setStatusFilter("En maintenance")}
                  >
                    En Maintenance
                  </Badge>
                  <Badge
                    variant={statusFilter === "Loué" ? "default" : "outline"}
                    className="cursor-pointer px-4 py-1.5"
                    onClick={() => setStatusFilter("Loué")}
                  >
                    Loué
                  </Badge>
                </div>
              </div>

              {/* Clear All Filters */}
              {(searchTerm ||
                statusFilter !== "all" ||
                marqueFilter !== "all") && (
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setMarqueFilter("all");
                    }}
                    className="text-xs"
                  >
                    Effacer tous les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Results Header */}
          {!loading && (
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {vehicles.length > 0 ? (
                    <>
                      {vehicles.length} véhicule
                      {vehicles.length > 1 ? "s" : ""}
                      {(searchTerm ||
                        statusFilter !== "all" ||
                        marqueFilter !== "all") &&
                        " trouvé"}
                      {(searchTerm ||
                        statusFilter !== "all" ||
                        marqueFilter !== "all") &&
                      vehicles.length > 1
                        ? "s"
                        : ""}
                    </>
                  ) : (
                    "Aucun résultat"
                  )}
                </h2>
                {vehicles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    marqueFilter !== "all"
                      ? "Résultats filtrés"
                      : "Tous les véhicules disponibles"}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">
                Chargement des véhicules...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && vehicles.length === 0 && (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun véhicule trouvé
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}

          {/* Vehicles Grid */}
          {!loading && vehicles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <CarCard
                  key={vehicle.id}
                  id={vehicle.id}
                  marque={vehicle.marque}
                  modele={vehicle.modele}
                  immatriculation={vehicle.immatriculation}
                  etat={vehicle.etat}
                  prixJour={vehicle.prixJour}
                  image={vehicle.image}
                  createdAt={vehicle.createdAt}
                  onReserve={handleReserve}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CarsPage;
