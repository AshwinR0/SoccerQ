import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSeasonContext } from "@/contexts/SeasonContext";

const SeasonSelector = () => {
  const { currentSeason, seasons, setCurrentSeason } = useSeasonContext();

  const handleSeasonChange = (season_id: string) => {
    const selectedSeason = seasons.find(season => season.id === season_id);
    if (selectedSeason) {
      setCurrentSeason(selectedSeason);
    }
  };

  return (
    <Select value={currentSeason?.id || ""} onValueChange={handleSeasonChange}>
      <SelectTrigger className="w-[180px] bg-card border-border">
        <SelectValue placeholder="Select Season" />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        {seasons.map((season) => (
          <SelectItem key={season.id} value={season.id} className="text-foreground hover:bg-muted">
            {season.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SeasonSelector;