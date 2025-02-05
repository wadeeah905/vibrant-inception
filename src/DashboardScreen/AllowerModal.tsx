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

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        // Fetch all seasons
        const response = await fetch('https://plateform.draminesaid.com/app/get_saisons.php');
        const data = await response.json();
        
        // Fetch allocated seasons for this user
        const allocatedResponse = await fetch('https://plateform.draminesaid.com/app/get_user_saisons.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        const allocatedData = await allocatedResponse.json();
        console.log('Allocated seasons response:', allocatedData);

        if (data.success) {
          setSeasons(data.saisons);
          if (allocatedData.success) {
            // Map through the allocated seasons and extract id_saison values
            const allocatedIds = allocatedData.seasons.map((s: any) => s.id_saison.toString());
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
    setSelectedSeasons(prev =>
      prev.includes(seasonId)
        ? prev.filter(id => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handleAllocation = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/add_allocation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          seasons: selectedSeasons.map(id => parseInt(id))
        }),
      });
      
      const data = await response.json();
      console.log('Allocation response:', data);

      if (data.success) {
        setAlertMessage('Saisons allouées avec succès!');
        onClose();
      } else {
        throw new Error(data.message || 'Une erreur est survenue');
      }
    } catch (error: any) {
      console.error("Error during allocation:", error);
      setAlertMessage(error.message || "Erreur lors de l'allocation");
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  if (loadingSeasons) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chargement des saisons...</DialogTitle>
          </DialogHeader>
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
            <Alert variant="default" className="mb-4">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          )}

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-3">
              {seasons.map((season) => (
                <Card key={season.id_saison} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
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
            disabled={loading}
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