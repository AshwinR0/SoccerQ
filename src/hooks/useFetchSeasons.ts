import { useEffect, useState } from 'react';
import { Season } from '@/types';
import { getSeasons } from '@/services/api';

export const useFetchSeasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const fetchedSeasons = await getSeasons();
        setSeasons([...fetchedSeasons].reverse());
        const activeSeason = fetchedSeasons.reverse().find(season => season.isActive) || fetchedSeasons[0];
        if (activeSeason) {
          setCurrentSeason(activeSeason);
        }
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeasons();
  }, []);

  return { seasons, setSeasons, currentSeason, setCurrentSeason, loading, error };
};
