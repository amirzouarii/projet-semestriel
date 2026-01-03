import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Car, DollarSign } from "lucide-react";

interface CarCardProps {
  id: number;
  marque: string;
  modele: string;
  immatriculation: string;
  etat: string;
  prixJour: number;
  image?: string;
  createdAt?: string;
  onReserve?: (id: number) => void;
}

function CarCard({
  id,
  marque,
  modele,
  immatriculation,
  etat,
  prixJour,
  image,
  createdAt,
  onReserve,
}: CarCardProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "disponible":
        return "bg-green-500 hover:bg-green-600";
      case "en maintenance":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "loué":
      case "loue":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/car/${id}`)}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          {image ? (
            <img
              src={image}
              alt={`${marque} ${modele}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <Car className="w-20 h-20 text-gray-400" />
            </div>
          )}
          <Badge
            className={`absolute top-3 right-3 ${getStatusColor(etat)}`}
          >
            {etat}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 flex-grow">
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {marque} {modele}
            </h3>
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <span className="font-medium">Immatriculation:</span>{" "}
              {immatriculation}
            </p>
          </div>

          <div className="flex items-center gap-2 text-3xl font-bold text-primary">
            <DollarSign className="w-6 h-6" />
            <span>{Number(prixJour).toFixed(2)}</span>
            <span className="text-sm font-normal text-gray-500">/jour</span>
          </div>

          {createdAt && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Ajouté le {new Date(createdAt).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onReserve?.(id);
          }}
          disabled={etat.toLowerCase() !== "disponible"}
        >
          {etat.toLowerCase() === "disponible"
            ? "Réserver maintenant"
            : "Non disponible"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CarCard;
