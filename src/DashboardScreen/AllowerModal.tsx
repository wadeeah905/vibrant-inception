import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Season {
  id_saison: string;
  name_saison: string;
  photo_saison: string;
}

interface AllowerModalProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const AllowerModal: React.FC<AllowerModalProps> = ({ userId, isOpen, onClose }) => {
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [allocatedSeasons, setAllocatedSeasons] = useState<string[]>([]);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        // Fetch all seasons
        const response = await fetch('https://plateform.draminesaid.com/app/get_saisons.php');
        const data = await response.json();
        
        // Fetch allocated seasons for this user
        const allocatedResponse = await fetch('https://plateform.draminesaid.com/app/get_user_seasons.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        const allocatedData = await allocatedResponse.json();

        if (data.success) {
          setSeasons(data.saisons);
          if (allocatedData.success) {
            const allocatedIds = allocatedData.seasons.map((s: any) => s.id_saison);
            setAllocatedSeasons(allocatedIds);
            setSelectedSeasons(allocatedIds);
          }
        } else {
          console.error("Failed to fetch seasons");
          setAlertMessage("Erreur lors du chargement des saisons");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAlertMessage("Erreur lors du chargement des données");
        setShowAlert(true);
      } finally {
        setLoadingSeasons(false);
      }
    };

    if (isOpen) {
      fetchSeasons();
    }
  }, [userId, isOpen]);

  const handleSeasonSelection = (seasonId: string) => {
    setSelectedSeasons((prev) =>
      prev.includes(seasonId)
        ? prev.filter((id) => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handleDeallocation = async (seasonId: string) => {
    setLoading(true);
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/deallocation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          season_id: seasonId,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setAllocatedSeasons(prev => prev.filter(id => id !== seasonId));
        setSelectedSeasons(prev => prev.filter(id => id !== seasonId));
        setAlertMessage('Saison désallouée avec succès!');
      } else {
        throw new Error(data.message || 'Une erreur est survenue lors de la désallocation');
      }
    } catch (error: any) {
      console.error("Error during deallocation:", error);
      setAlertMessage(error.message || "Erreur lors de la désallocation");
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  const handleAllocation = async () => {
    setLoading(true);
    try {
      console.log('Sending allocation request:', {
        user_id: userId,
        seasons: selectedSeasons,
      });
      
      const response = await fetch('https://plateform.draminesaid.com/app/allocation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          seasons: selectedSeasons,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setAlertMessage('Utilisateur a été alloué avec succès!');
        setAllocatedSeasons(selectedSeasons);
        onClose();
      } else {
        throw new Error(data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error("Error during allocation:", error);
      setAlertMessage(error.message || "Erreur lors de l'allocation");
    } finally {
      setLoading(false);
      setShowAlert(true);
    }
  };

  if (loadingSeasons) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Allouer des Saisons</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-4">
            Sélectionnez les saisons à allouer à cet utilisateur :
          </p>

          {showAlert && (
            <Alert className="mb-4">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-3">
              {seasons.map((season) => (
                <Card key={season.id_saison} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSeasons.includes(season.id_saison)}
                        onChange={() => handleSeasonSelection(season.id_saison)}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                      />
                      <div>
                        <p className="text-sm font-medium" dir="rtl" lang="ar">
                          {season.name_saison}
                        </p>
                      </div>
                    </label>
                    {allocatedSeasons.includes(season.id_saison) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeallocation(season.id_saison)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleAllocation} 
            disabled={loading || selectedSeasons.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'En cours...' : "Confirmer l'allocation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AllowerModal;