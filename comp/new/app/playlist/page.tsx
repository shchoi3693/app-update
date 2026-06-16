import Search from '@/components/search/Search';
import PlayerView from '@/components/PlayerView';
import TabBar from '@/components/TabBar';

export default function Playlist({ userId }: { userId: string }) {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <Search userId={userId} />
      <PlayerView userId={userId} />
      <TabBar />
    </div>
  );
}
