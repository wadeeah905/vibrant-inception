import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSeasons, fetchChapters } from '@/api/chapters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Plus, X } from 'lucide-react';
import { AddSeasonForm } from '@/components/seasons/AddSeasonForm';
import { AddChapterForm } from '@/components/seasons/AddChapterForm';
import { useToast } from '@/hooks/use-toast';
import Modal from '../DashboardScreen/Modal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const Seasons = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [seasonToDelete, setSeasonToDelete] = useState<string | null>(null);
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null);

  const { data: seasonsData, isLoading: isLoadingSeasons } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });

  const { data: chaptersData, isLoading: isLoadingChapters } = useQuery({
    queryKey: ['chapters'],
    queryFn: fetchChapters,
  });

  const handleDeleteSeason = async () => {
    if (!seasonToDelete) return;
    
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/delete_saison.php', {
        method: 'DELETE',
        body: `id_saison=${seasonToDelete}`,
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Saison supprimée avec succès",
        });
        queryClient.invalidateQueries({ queryKey: ['seasons'] });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message || "Échec de la suppression de la saison",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la suppression de la saison",
      });
    } finally {
      setSeasonToDelete(null);
    }
  };

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return;
    
    try {
      const response = await fetch('https://plateform.draminesaid.com/app/delete_chapter.php', {
        method: 'DELETE',
        body: `id_chapter=${chapterToDelete}`,
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Succès",
          description: "Chapitre supprimé avec succès",
        });
        queryClient.invalidateQueries({ queryKey: ['chapters'] });
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: data.message || "Échec de la suppression du chapitre",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de la suppression du chapitre",
      });
    } finally {
      setChapterToDelete(null);
    }
  };

  if (isLoadingSeasons || isLoadingChapters) {
    return (
      <div className="p-6 mt-16 space-y-6">
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 mt-16 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Liste des saisons</h2>
        <div className="flex space-x-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une saison
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle saison</DialogTitle>
              </DialogHeader>
              <AddSeasonForm />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un chapitre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau chapitre</DialogTitle>
              </DialogHeader>
              <AddChapterForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Seasons Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {seasonsData?.saisons.map((season) => (
          <Card key={`overview-${season.id_saison}`} className="bg-dashboard-card border-border/40 relative">
            <button
              onClick={() => setSeasonToDelete(season.id_saison)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
            </button>
            <CardHeader className="space-y-1">
              <div className="flex items-center space-x-4">
                {season.photo_saison ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={`https://draminesaid.com/videos/${season.photo_saison}`}
                      alt={season.name_saison}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                ) : (
                  <BookOpen className="h-16 w-16 text-primary p-4 bg-primary/10 rounded-lg" />
                )}
                <div>
                  <CardTitle className="text-xl font-semibold">{season.name_saison}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {chaptersData?.chapters.filter(chapter => chapter.id_saison === season.id_saison).length || 0} chapitres
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Detailed Seasons with Chapters Section */}
      <h2 className="text-2xl font-bold mt-12 mb-6">Détails des saisons et chapitres</h2>
      <div className="grid gap-6">
        {seasonsData?.saisons.map((season) => (
          <Card key={season.id_saison} className="bg-dashboard-card border-border/40">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {season.photo_saison ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={`https://draminesaid.com/videos/${season.photo_saison}`}
                        alt={season.name_saison}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  ) : (
                    <BookOpen className="h-5 w-5 text-primary" />
                  )}
                  <CardTitle className="text-xl font-semibold">{season.name_saison}</CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">
                  {chaptersData?.chapters.filter(chapter => chapter.id_saison === season.id_saison).length || 0} chapitres
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chaptersData?.chapters
                  .filter((chapter) => chapter.id_saison === season.id_saison)
                  .map((chapter) => (
                    <Card key={chapter.id_chapter} className="overflow-hidden relative">
                      <button
                        onClick={() => setChapterToDelete(chapter.id_chapter)}
                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
                      >
                        <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      </button>
                      <div className="aspect-video relative">
                        <img
                          src={`https://draminesaid.com/videos/${chapter.photo_chapter}`}
                          alt={chapter.name_chapter}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold">{chapter.name_chapter}</h3>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Modals */}
      {seasonToDelete && (
        <Modal
          action="supprimer"
          message="Cette saison sera supprimée définitivement. Voulez-vous continuer ?"
          onConfirm={handleDeleteSeason}
          onCancel={() => setSeasonToDelete(null)}
        />
      )}

      {chapterToDelete && (
        <Modal
          action="supprimer"
          message="Ce chapitre sera supprimé définitivement. Voulez-vous continuer ?"
          onConfirm={handleDeleteChapter}
          onCancel={() => setChapterToDelete(null)}
        />
      )}
    </div>
  );
};

export default Seasons;