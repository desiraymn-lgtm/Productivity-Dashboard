import { sql } from '@/lib/db';
import AddProspectForm from '@/components/AddProspectForm';
import ProspectGrid from '@/components/ProspectGrid';
import BusinessNotesList from '@/components/BusinessNotesList';
import type { BusinessProspect, BusinessNote } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function BusinessPage() {
  const [prospects, notes] = (await Promise.all([
    sql`select * from business_prospects order by created_at desc`,
    sql`select * from business_notes order by created_at desc`,
  ])) as [BusinessProspect[], BusinessNote[]];

  return (
    <div className="page-wrap">
      <div className="page-head">
        <h1>Business</h1>
        <p>Tracking prospects for the business you're looking to buy — an established, "boring" business from a retiring owner.</p>
      </div>
      <AddProspectForm />
      <ProspectGrid prospects={prospects} />
      <BusinessNotesList notes={notes} />
    </div>
  );
}
