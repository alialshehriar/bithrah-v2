import { EarlyAccessModal } from '@/components/EarlyAccessModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50/30 to-pink-50/30">
      <EarlyAccessModal isOpen={true} />
    </div>
  );
}
