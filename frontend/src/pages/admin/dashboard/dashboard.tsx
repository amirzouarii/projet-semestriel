import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";
import { useAuth } from "../../../hooks/AuthHook";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";

interface UserItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  interface VehicleItem {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
    etat: string;
    prixJour: number;
    image?: string;
    createdAt: string;
  }

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [updatingVehicleId, setUpdatingVehicleId] = useState<number | null>(null);

  const STATUS_OPTIONS = ["Disponible", "En maintenance", "Loué"];

  // Add / delete vehicle UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<VehicleItem>>({
    marque: "",
    modele: "",
    immatriculation: "",
    etat: STATUS_OPTIONS[0],
    prixJour: 0,
    image: "",
  });
  const [creating, setCreating] = useState(false);

  // Reservations admin
  interface ReservationItem {
    id: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: string;
    user: { id: number; firstName: string; lastName: string; email: string };
    vehicle: { id: number; marque: string; modele: string; immatriculation: string };
  }

  const [pendingReservations, setPendingReservations] = useState<ReservationItem[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);
  useEffect(() => {
    // Wait until auth initialization finishes before redirecting
    if (isLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if ((user.role ?? "").toUpperCase() !== "ADMIN") {
      toast.error("Accès refusé: vous n'êtes pas administrateur");
      navigate("/");
      return;
    }

    fetchUsers();
    fetchVehicles();
    fetchPendingReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const resp = await api.get("/users?page=1&limit=50");
      const data = Array.isArray(resp.data)
        ? resp.data
        : resp.data?.data ?? [];
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setVehiclesLoading(true);
      const resp = await api.get("/vehicles?page=1&limit=100");
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Impossible de charger les véhicules");
    } finally {
      setVehiclesLoading(false);
    }
  };

  const updateVehicleStatus = async (id: number, etat: string) => {
    try {
      setUpdatingVehicleId(id);
      await api.patch(`/vehicles/${id}`, { etat });
      setVehicles((prev) => prev.map(v => v.id === id ? { ...v, etat } : v));
      toast.success("Statut mis à jour");
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      toast.error("Impossible de mettre à jour le statut");
    } finally {
      setUpdatingVehicleId(null);
    }
  };

  const fetchPendingReservations = async () => {
    try {
      setReservationsLoading(true);
      const resp = await api.get('/reservations?page=1&limit=100&status=PENDING');
      const data = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
      setPendingReservations(data);
    } catch (err) {
      console.error('Error fetching reservations', err);
      toast.error('Impossible de charger les réservations');
    } finally {
      setReservationsLoading(false);
    }
  };

  const approveReservation = async (id: number) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'APPROVED' });
      toast.success('Réservation approuvée');
      // Refresh lists
      fetchPendingReservations();
      fetchVehicles();
    } catch (err) {
      console.error('Error approving reservation', err);
      toast.error('Impossible d\u2019approuver la réservation');
    }
  };

  const rejectReservation = async (id: number) => {
    try {
      await api.patch(`/reservations/${id}/status`, { status: 'CANCELLED' });
      toast.success('Réservation refusée');
      fetchPendingReservations();
    } catch (err) {
      console.error('Error rejecting reservation', err);
      toast.error('Impossible de refuser la réservation');
    }
  };

  return (
    <div className="min-h-screen bg-background w-full p-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <div>
            <Button variant="ghost" onClick={() => navigate('/')}>Retour</Button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Liste des utilisateurs</p>
        </div>

        {loading ? (
          <div className="text-center py-10">Chargement...</div>
        ) : (
          <div className="overflow-x-auto bg-card border rounded-lg">
            <table className="min-w-full divide-y table-auto">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Nom</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Prénom</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium">Créé le</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-sm">{u.id}</td>
                    <td className="px-4 py-3 text-sm">{u.firstName}</td>
                    <td className="px-4 py-3 text-sm">{u.lastName}</td>
                    <td className="px-4 py-3 text-sm">{u.email}</td>
                    <td className="px-4 py-3 text-sm">{u.role}</td>
                    <td className="px-4 py-3 text-sm">{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pending reservations (admin) */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Réservations en attente</p>
            <div>
              <Button size="sm" variant="ghost" onClick={() => fetchPendingReservations()}>Refresh</Button>
            </div>
          </div>

          {reservationsLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : (
            <div className="overflow-x-auto bg-card border rounded-lg">
              <table className="min-w-full divide-y table-auto">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Utilisateur</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Voiture</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Dates</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Prix total</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y">
                  {pendingReservations.map((r) => (
                    <tr key={r.id}>
                      <td className="px-4 py-3 text-sm">{r.id}</td>
                      <td className="px-4 py-3 text-sm">{r.user.firstName} {r.user.lastName} <div className="text-xs text-muted-foreground">{r.user.email}</div></td>
                      <td className="px-4 py-3 text-sm">{r.vehicle.marque} {r.vehicle.modele} <div className="text-xs text-muted-foreground">{r.vehicle.immatriculation}</div></td>
                      <td className="px-4 py-3 text-sm">{new Date(r.startDate).toLocaleDateString()} → {new Date(r.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">{Number(r.totalPrice).toFixed(2)} €</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => approveReservation(r.id)}>Valider</Button>
                          <Button size="sm" variant="destructive" onClick={() => rejectReservation(r.id)}>Refuser</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {pendingReservations.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted-foreground">Aucune réservation en attente</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Vehicles section for admin */}
        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Gestion des véhicules</p>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setShowAddForm((s) => !s)}>
                {showAddForm ? "Annuler" : "Ajouter une voiture"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => fetchVehicles()}>Refresh</Button>
            </div>
          </div>

          {showAddForm && (
            <div className="mb-6 p-4 bg-card border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input className="p-2 rounded border" placeholder="Marque" value={newVehicle.marque ?? ""} onChange={(e) => setNewVehicle({...newVehicle, marque: e.target.value})} />
                <input className="p-2 rounded border" placeholder="Modèle" value={newVehicle.modele ?? ""} onChange={(e) => setNewVehicle({...newVehicle, modele: e.target.value})} />
                <input className="p-2 rounded border" placeholder="Immatriculation" value={newVehicle.immatriculation ?? ""} onChange={(e) => setNewVehicle({...newVehicle, immatriculation: e.target.value})} />
                <input type="number" className="p-2 rounded border" placeholder="Prix / jour" value={newVehicle.prixJour ?? 0} onChange={(e) => setNewVehicle({...newVehicle, prixJour: Number(e.target.value)})} />

                {/* Image URL + preview */}
                <input className="p-2 rounded border col-span-1 md:col-span-2" placeholder="Image URL (externe ou chemin)" value={newVehicle.image ?? ""} onChange={(e) => setNewVehicle({...newVehicle, image: e.target.value})} />
                <div className="col-span-1 md:col-span-2 flex items-center justify-center">
                  {newVehicle.image ? (
                    // Note: trust the URL returned by the backend; if relative paths are used, prefix with backend URL elsewhere
                    <img src={newVehicle.image} alt="Aperçu voiture" className="w-full h-24 object-cover rounded-md" />
                  ) : (
                    <div className="w-full h-24 bg-muted rounded-md flex items-center justify-center text-sm text-muted-foreground">Aperçu image</div>
                  )}
                </div>

                <select className="rounded-md border p-2" value={newVehicle.etat} onChange={(e) => setNewVehicle({...newVehicle, etat: e.target.value})}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="col-span-1 md:col-span-4 flex items-center gap-2">
                  <Button size="sm" onClick={async () => {
                    if (!newVehicle.marque || !newVehicle.modele || !newVehicle.immatriculation || !newVehicle.prixJour) {
                      toast.error("Veuillez remplir tous les champs requis");
                      return;
                    }
                    try {
                      setCreating(true);
                      await api.post('/vehicles', newVehicle);
                      toast.success('Voiture créée');
                      setShowAddForm(false);
                      setNewVehicle({ marque: '', modele: '', immatriculation: '', etat: STATUS_OPTIONS[0], prixJour: 0, image: '' });
                      fetchVehicles();
                    } catch (err) {
                      console.error('Error creating vehicle', err);
                      toast.error('Impossible de créer la voiture');
                    } finally {
                      setCreating(false);
                    }
                  }} disabled={creating}>{creating ? 'Création...' : 'Créer'}</Button>
                </div>
              </div>
            </div>
          )}

          {vehiclesLoading ? (
            <div className="text-center py-10">Chargement...</div>
          ) : (
            <div className="overflow-x-auto bg-card border rounded-lg">
              <table className="min-w-full divide-y table-auto">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">#</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Marque</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Modèle</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Immat.</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Statut</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Prix / jour</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y">
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td className="px-4 py-3 text-sm">{v.id}</td>
                      <td className="px-4 py-3 text-sm">{v.marque}</td>
                      <td className="px-4 py-3 text-sm">{v.modele}</td>
                      <td className="px-4 py-3 text-sm">{v.immatriculation}</td>
                      <td className="px-4 py-3 text-sm">{v.etat}</td>
                      <td className="px-4 py-3 text-sm">{v.prixJour} €</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <select
                            value={v.etat}
                            onChange={(e) => updateVehicleStatus(v.id, e.target.value)}
                            className="rounded-md border px-2 py-1 text-sm"
                            disabled={updatingVehicleId === v.id}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => fetchVehicles()}
                          >
                            Refresh
                          </Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            if (!confirm('Voulez-vous vraiment supprimer cette voiture ?')) return;
                            try {
                              await api.delete(`/vehicles/${v.id}`);
                              toast.success('Voiture supprimée');
                              fetchVehicles();
                            } catch (err) {
                              console.error('Error deleting vehicle', err);
                              toast.error('Impossible de supprimer la voiture');
                            }
                          }}>Supprimer</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {vehicles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        Aucun véhicule trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
