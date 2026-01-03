import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarCard from "../../components/carCard";
import { Button } from "../../components/ui/button";
import api from "../../lib/api";
import {
  Car,
  Shield,
  Clock,
  Star,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

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

function HomePage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/vehicles");
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
    navigate(`/reservation/${id}`);
  };

  // Show only first 6 vehicles on homepage
  const displayedVehicles = vehicles.slice(0, 6);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Louez Votre Voiture Idéale
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Des véhicules de qualité, des prix compétitifs, une expérience
              exceptionnelle
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="default"
                className="text-lg px-8"
                onClick={() => {
                  document
                    .getElementById("vehicles-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Découvrir nos véhicules
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large Sélection</h3>
              <p className="text-gray-600">
                Choisissez parmi une variété de véhicules adaptés à tous vos
                besoins
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Assurance Complète</h3>
              <p className="text-gray-600">
                Tous nos véhicules sont entièrement assurés pour votre
                tranquillité
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation Facile</h3>
              <p className="text-gray-600">
                Réservez en quelques clics et récupérez votre véhicule
                rapidement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Section */}
      <section id="vehicles-section" className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Nos Véhicules Disponibles
            </h2>
            <p className="text-gray-600 text-lg">
              Découvrez une sélection de nos meilleurs véhicules
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
              <p className="mt-4 text-muted-foreground">Chargement des véhicules...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && displayedVehicles.length === 0 && (
            <div className="text-center py-20">
              <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Aucun véhicule trouvé
              </h3>
              <p className="text-muted-foreground">
                Aucun véhicule disponible pour le moment
              </p>
            </div>
          )}

          {/* Vehicles Grid */}
          {!loading && displayedVehicles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedVehicles.map((vehicle) => (
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

          {/* Show More Button */}
          {!loading && displayedVehicles.length > 0 && vehicles.length > 6 && (
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8"
                onClick={() => navigate("/cars")}
              >
                Voir tous les véhicules
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container mx-auto text-center">
          <Star className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-4xl font-bold mb-4">
            Prêt à Commencer Votre Aventure ?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Rejoignez des milliers de clients satisfaits
          </p>
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 bg-white text-black hover:bg-gray-100 border-white"
            onClick={() => {
              const token = localStorage.getItem("jwt");
              if (!token) {
                navigate("/login");
              } else {
                document
                  .getElementById("vehicles-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Réserver Maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
