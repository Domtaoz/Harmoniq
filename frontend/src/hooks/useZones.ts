import { GET_ZONES_BY_CONCERT } from '@/graphql/queries';
import { Zone } from '@/types';
import client from '@/lib/graphqlClient';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const { id } = useParams<{ id: string }>();
const concertId = Number(id);

const { data: zones, isLoading: loadingZones } = useQuery({
  queryKey: ['zones', concertId],
  queryFn: async (): Promise<Zone[]> => {
    const res = await client.request<{ getZonesByConcert: Zone[] }>(
      GET_ZONES_BY_CONCERT,
      { concertId }
    );
    return res.getZonesByConcert;
  },
  enabled: !!concertId,
});
