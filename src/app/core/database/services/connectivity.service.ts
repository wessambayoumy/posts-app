import { Injectable, signal } from '@angular/core';
import * as Network from 'expo-network';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  readonly isOnline = signal<boolean>(true);
  readonly isInternetReachable = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  constructor() {
    void this.refreshStatus();
  }

  async refreshStatus(): Promise<boolean> {
    try {
      const state = await Network.getNetworkStateAsync();
      const connected = Boolean(state.isConnected);
      const reachable =
        state.isInternetReachable === undefined || state.isInternetReachable === null
          ? connected
          : Boolean(state.isInternetReachable);

      this.isOnline.set(connected);
      this.isInternetReachable.set(reachable);
      this.error.set(null);
      return connected && reachable;
    } catch {
      this.error.set('Unable to check network status.');
      return false;
    }
  }
}