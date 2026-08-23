import { toggleRewardStatus, deleteReward } from '@/app/actions';
import type { Reward } from '@/lib/types';

export default function RewardsGrid({ rewards }: { rewards: Reward[] }) {
  const wishlist = rewards.filter((r) => r.status === 'wishlist');
  const earned = rewards.filter((r) => r.status === 'earned');
  const wishlistTotal = wishlist.reduce((sum, r) => sum + Number(r.cost || 0), 0);

  return (
    <>
      <h2 className="section-title">Wishlist</h2>
      {wishlist.length === 0 && <p className="empty">Nothing on the wishlist yet.</p>}
      <div className="prospect-grid">
        {wishlist.map((reward) => (
          <RewardCard key={reward.id} reward={reward} />
        ))}
      </div>

      {earned.length > 0 && (
        <>
          <h2 className="section-title">Earned</h2>
          <div className="prospect-grid">
            {earned.map((reward) => (
              <RewardCard key={reward.id} reward={reward} />
            ))}
          </div>
        </>
      )}

      <div className="rewards-total">
        <span>Wishlist total</span>
        <span className="rewards-total-amount">
          {wishlistTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>
      </div>
    </>
  );
}

function RewardCard({ reward }: { reward: Reward }) {
  const toggleWithId = toggleRewardStatus.bind(null, reward.id, reward.status);
  const deleteWithId = deleteReward.bind(null, reward.id);

  return (
    <div className="prospect-card">
      {reward.image_url && (
        <a href={reward.image_url} target="_blank" rel="noopener noreferrer" className="reward-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={reward.image_url} alt={reward.title} />
        </a>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="prospect-name">{reward.title}</span>
        <form action={deleteWithId}>
          <button type="submit" className="row-delete" aria-label="Delete reward">
            ×
          </button>
        </form>
      </div>
      {reward.goal_note && <span className="prospect-meta">For: {reward.goal_note}</span>}
      {reward.cost && (
        <span className="prospect-meta">{Number(reward.cost).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
      )}
      {reward.description && <p className="book-notes">{reward.description}</p>}
      <form action={toggleWithId}>
        <button
          type="submit"
          className={`status-pill status-${reward.status === 'earned' ? 'finished' : 'want'}`}
          style={{ border: 'none', cursor: 'pointer', marginTop: 4 }}
        >
          {reward.status === 'earned' ? '✓ Earned — tap to move back' : 'Mark as earned'}
        </button>
      </form>
    </div>
  );
}
