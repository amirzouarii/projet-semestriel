import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { useAuth } from "../../hooks/AuthHook";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  Car,
} from "lucide-react";

interface Reservation {
  id: number;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "CANCELLED";
  totalPrice: number;
  vehicle: {
    id: number;
    // backend uses French field names; accept both shapes for safety
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    marque?: string;
    modele?: string;
    immatriculation?: string;
    image?: string;
  };
}

export default function ReservationsPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load
    
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchReservations = async () => {
      try {
        setPageLoading(true);
        const response = await api.get("/reservations");
        setReservations(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Failed to load reservations");
      } finally {
        setPageLoading(false);
      }
    };

    fetchReservations();
  }, [user, isLoading, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          icon: "text-emerald-500",
          border: "border-emerald-200",
        };
      case "PENDING":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          icon: "text-amber-500",
          border: "border-amber-200",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: "text-red-500",
          border: "border-red-200",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          icon: "text-gray-500",
          border: "border-gray-200",
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5" />;
      case "PENDING":
        return <AlertCircle className="w-5 h-5" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (pageLoading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground font-medium">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-2">
                Mes Réservations
              </h1>
              <p className="text-muted-foreground text-lg">
                Gérez et consultez vos réservations de véhicules
              </p>
            </div>
            <Button
              onClick={() => navigate("/cars")}
              size="lg"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle Réservation
            </Button>
          </div>
        </div>

        {reservations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="pt-12 text-center pb-12">
              <div className="inline-block p-4 bg-muted rounded-full mb-4">
                <MapPin className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-6 font-medium">
                Vous n'avez aucune réservation pour le moment
              </p>
              <p className="text-muted-foreground mb-8">
                Commencez à explorer nos véhicules disponibles et réservez le vôtre dès maintenant!
              </p>
              <Button
                onClick={() => navigate("/cars")}
                size="lg"
                className="gap-2"
              >
                <Plus className="w-5 h-5" />
                Parcourir les voitures
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Confirmées</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {reservations.filter((r) => r.status === "APPROVED").length}
                      </p>
                    </div>
                    <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">En attente</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {reservations.filter((r) => r.status === "PENDING").length}
                      </p>
                    </div>
                    <AlertCircle className="w-12 h-12 text-yellow-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Annulées</p>
                      <p className="text-3xl font-bold text-foreground mt-2">
                        {reservations.filter((r) => r.status === "CANCELLED").length}
                      </p>
                    </div>
                    <XCircle className="w-12 h-12 text-red-600 opacity-20" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reservations List */}
            {reservations.map((reservation, index) => {
              const colors = getStatusColor(reservation.status);
              const days = calculateDays(
                reservation.startDate,
                reservation.endDate
              );
              return (
                <Card key={reservation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      {/* Vehicle & Dates */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                              {reservation.vehicle.image ? (
                                <img src={reservation.vehicle.image} alt={`${reservation.vehicle.marque ?? reservation.vehicle.make} ${reservation.vehicle.modele ?? reservation.vehicle.model}`} className="w-36 h-24 object-cover rounded-md" />
                              ) : (
                                <div className="w-36 h-24 bg-muted rounded-md flex items-center justify-center">
                                  <Car className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <h2 className="text-2xl font-bold text-foreground mb-1">
                                  {reservation.vehicle.marque ?? reservation.vehicle.make}{" "}
                                  <span className="text-muted-foreground">
                                    {reservation.vehicle.modele ?? reservation.vehicle.model}
                                  </span>
                                </h2>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  {reservation.vehicle.immatriculation ?? reservation.vehicle.licensePlate}
                                </p>
                              </div>
                            </div>
                          <Badge
                            variant="outline"
                            className="gap-2"
                            style={{
                              backgroundColor: colors.bg,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
                          >
                            <span className={colors.icon}>
                              {getStatusIcon(reservation.status)}
                            </span>
                            {reservation.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-semibold">
                                Début
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {formatDate(reservation.startDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-semibold">
                                Fin
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {formatDate(reservation.endDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs text-muted-foreground uppercase font-semibold">
                                Durée
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {days} jour{days !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex flex-col items-start lg:items-end gap-4 pt-4 lg:pt-0 lg:border-l border-border lg:pl-6">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground font-medium mb-1">
                            Prix total
                          </p>
                          <p className="text-4xl font-bold text-foreground">
                            {Number(reservation.totalPrice).toFixed(2)}
                            <span className="text-lg text-muted-foreground">€</span>
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 w-full lg:w-auto">
                          <Button
                            onClick={() =>
                              navigate(
                                `/car/${reservation.vehicle.id}`
                              )
                            }
                            className="gap-2"
                          >
                            Voir la voiture
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/cars")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux voitures
          </Button>
        </div>
      </div>
    </div>
  );
}
