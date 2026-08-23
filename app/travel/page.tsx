import { sql } from '@/lib/db';
import AddTravelForm from '@/components/AddTravelForm';
import TravelGrid from '@/components/TravelGrid';
import type { TravelSpot } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function TravelPage() {
  const spots = (await sql`
    select * from travel_spots
    order by (status = 'been') asc, created_at desc
  `) as TravelSpot[];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Travel</h1>
        <p>Where you&apos;ve been, and everywhere you still want to go.</p>
      </div>
      <AddTravelForm />
      <TravelGrid spots={spots} />
    </div>
  );
}
