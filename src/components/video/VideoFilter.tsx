import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSeasons, fetchChapters } from '@/api/chapters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSeason: string;
  onSeasonChange: (value: string) => void;
  selectedChapter: string;
  onChapterChange: (value: string) => void;
}

const VideoFilter: React.FC<VideoFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedSeason,
  onSeasonChange,
  selectedChapter,
  onChapterChange
}) => {
  const { data: seasonsData, isLoading: seasonsLoading, error: seasonsError } = useQuery({
    queryKey: ['seasons'],
    queryFn: fetchSeasons,
  });

  const { data: chaptersData, isLoading: chaptersLoading, error: chaptersError } = useQuery({
    queryKey: ['chapters'],
    queryFn: fetchChapters,
  });

  const filteredChapters = chaptersData?.chapters?.filter(
    chapter => selectedSeason && selectedSeason !== 'all' ? chapter.id_saison === selectedSeason : true
  ) || [];

  const seasons = seasonsData?.saisons || [];
  const hasSeasons = seasons.length > 0;

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        placeholder="البحث عن الفيديوهات..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 py-2 rounded-lg bg-dashboard-card border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary text-black"
        dir="rtl"
      />
      
      <Select 
        value={selectedSeason} 
        onValueChange={onSeasonChange}
        disabled={seasonsLoading}
      >
        <SelectTrigger className="text-black bg-white">
          <SelectValue placeholder={seasonsLoading ? "Chargement..." : "اختر الموسم"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-black">كل المواسم</SelectItem>
          {hasSeasons ? (
            seasons.map((season) => (
              <SelectItem key={season.id_saison} value={season.id_saison} className="text-black">
                {season.name_saison}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-seasons" disabled className="text-gray-400">
              {seasonsError ? "Erreur de chargement" : "Aucune saison disponible"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <Select 
        value={selectedChapter} 
        onValueChange={onChapterChange}
        disabled={!selectedSeason || selectedSeason === 'all' || chaptersLoading}
      >
        <SelectTrigger className="text-black bg-white">
          <SelectValue placeholder={chaptersLoading ? "Chargement..." : "اختر الفصل"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-black">كل الفصول</SelectItem>
          {filteredChapters.length > 0 ? (
            filteredChapters.map((chapter) => (
              <SelectItem key={chapter.id_chapter} value={chapter.id_chapter} className="text-black">
                {chapter.name_chapter}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-chapters" disabled className="text-gray-400">
              {chaptersError ? "Erreur de chargement" : "Aucun chapitre disponible"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VideoFilter;