import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { getSyncStatus, isOnline, syncWithServer } from '../utils/offlineStorage';

export function SyncIndicator() {
  const [online, setOnline] = useState(isOnline());
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      // Auto-sync when coming back online
      handleSync();
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check sync status periodically
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus());
    }, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!online) return;
    
    setSyncing(true);
    await syncWithServer();
    setSyncStatus(getSyncStatus());
    setSyncing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status */}
      <Badge
        variant={online ? 'default' : 'secondary'}
        className={`flex items-center gap-1 ${
          online ? 'bg-green-600' : 'bg-gray-500'
        }`}
      >
        {online ? (
          <>
            <Wifi className="w-3 h-3" />
            <span className="text-xs">Online</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3" />
            <span className="text-xs">Offline</span>
          </>
        )}
      </Badge>

      {/* Sync Status */}
      {online && (
        <button
          onClick={handleSync}
          disabled={syncing || !syncStatus.needsSync}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
            syncStatus.needsSync
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {syncing ? (
            <>
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : syncStatus.needsSync ? (
            <>
              <CloudOff className="w-3 h-3" />
              <span>Sync Pending</span>
            </>
          ) : (
            <>
              <Cloud className="w-3 h-3" />
              <span>Synced</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
