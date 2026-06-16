import TrackList from './track/TrackList';
import Turntable from './turntable/Turntable';

export default function PlayerView({ userId }: { userId: string }) {
  return (
    <div className="absolute inset-0 mb-[20vh]">
      <TrackList userId={userId} />
      <Turntable />
    </div>
  );
}
