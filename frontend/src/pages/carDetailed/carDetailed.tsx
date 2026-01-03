import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import api from "../../lib/api";
import {
  ArrowLeft,
  Calendar,
  Car,
  DollarSign,
  Shield,
  Clock,
  Fuel,
  Gauge,
  Users,
  Settings,
  Palette,
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
  annee?: number;
  couleur?: string;
  kilometrage?: number;
  carburant?: string;
  transmission?: string;
  places?: number;
  description?: string;
}

function CarDetailed() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/vehicles/${id}`);
      setVehicle(response.data);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      toast.error("Impossible de charger le véhicule");
      navigate("/cars");
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.info("Veuillez vous connecter pour réserver");
      navigate("/login");
      return;
    }
    navigate(`/reservation/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "bg-green-500";
      case "en maintenance":
        return "bg-yellow-500";
      case "loué":
      case "loue":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background w-full flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Véhicule non trouvé
          </h3>
          <Button onClick={() => navigate("/cars")}>
            Retour aux véhicules
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Header */}
      <section className="bg-black text-white py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4"
            onClick={() => navigate("/cars")}
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Retour aux véhicules
          </Button>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gray-200 border">
                {vehicle.image ? (
                  <img
                    src={vehicle.image}
                    alt={`${vehicle.marque} ${vehicle.modele}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <Car className="w-32 h-32 text-gray-400" />
                  </div>
                )}
                <Badge
                  className={`absolute top-4 right-4 ${getStatusColor(vehicle.etat)}`}
                >
                  {vehicle.etat}
                </Badge>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 gap-3">
                {vehicle.annee && (
                  <div className="p-3 bg-card border rounded-lg text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Année</p>
                    <p className="font-semibold">{vehicle.annee}</p>
                  </div>
                )}
                {vehicle.couleur && (
                  <div className="p-3 bg-card border rounded-lg text-center">
                    <Palette className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Couleur</p>
                    <p className="font-semibold">{vehicle.couleur}</p>
                  </div>
                )}
                {vehicle.kilometrage !== undefined && vehicle.kilometrage !== null && (
                  <div className="p-3 bg-card border rounded-lg text-center">
                    <Gauge className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Kilométrage</p>
                    <p className="font-semibold">{vehicle.kilometrage.toLocaleString()} km</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {vehicle.marque} {vehicle.modele}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="font-medium">Immatriculation:</span>
                  <span className="font-mono">{vehicle.immatriculation}</span>
                </p>
              </div>

              {/* Description */}
              {vehicle.description && (
                <div className="p-4 bg-card border rounded-lg">
                  <p className="text-muted-foreground">{vehicle.description}</p>
                </div>
              )}

              {/* Price */}
              <div className="p-6 bg-black text-white rounded-lg">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-8 h-8" />
                  <span className="text-5xl font-bold">
                    {Number(vehicle.prixJour).toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-300">/jour</span>
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  Spécifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {vehicle.carburant && (
                    <div className="p-4 bg-card border rounded-lg">
                      <Fuel className="w-6 h-6 mb-2 text-foreground" />
                      <p className="text-sm text-muted-foreground">Carburant</p>
                      <p className="font-medium">{vehicle.carburant}</p>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="p-4 bg-card border rounded-lg">
                      <Settings className="w-6 h-6 mb-2 text-foreground" />
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  )}
                  {vehicle.places && (
                    <div className="p-4 bg-card border rounded-lg">
                      <Users className="w-6 h-6 mb-2 text-foreground" />
                      <p className="text-sm text-muted-foreground">Places</p>
                      <p className="font-medium">{vehicle.places} personnes</p>
                    </div>
                  )}
                  <div className="p-4 bg-card border rounded-lg">
                    <Shield className="w-6 h-6 mb-2 text-foreground" />
                    <p className="text-sm text-muted-foreground">Assurance</p>
                    <p className="font-medium">Complète</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  size="lg"
                  className="w-full text-lg"
                  onClick={handleReserve}
                  disabled={vehicle.etat.toLowerCase() !== "disponible"}
                >
                  {vehicle.etat.toLowerCase() === "disponible"
                    ? "Réserver maintenant"
                    : "Non disponible"}
                </Button>
                {vehicle.etat.toLowerCase() !== "disponible" && (
                  <p className="text-sm text-muted-foreground text-center">
                    Ce véhicule n'est pas disponible à la réservation pour le moment
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CarDetailed;