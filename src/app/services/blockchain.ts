import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface BlockchainSubmission {
  id: string;
  hash: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
}

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private readonly http = inject(HttpClient);
  // Simulation of a Rust-based blockchain RPC endpoint
  // In a real scenario, this would be an actual RPC URL
  private readonly RPC_ENDPOINT = '/api/blockchain/push';
  
  submissions = signal<BlockchainSubmission[]>([]);

  /**
   * Pushes content to the blockchain for permanent storage.
   * This simulates an RPC call to a Rust-based node.
   */
  async pushToBlockchain(content: Record<string, unknown>): Promise<BlockchainSubmission> {
    const payload = {
      data: content,
      timestamp: Date.now(),
      version: "1.0.0-rust-arch"
    };

    try {
      // In a real implementation, we would call the actual Rust RPC
      // const response = await firstValueFrom(this.http.post<any>(this.RPC_ENDPOINT, payload));
      console.log('Sending payload to blockchain:', payload);
      
      // Simulating a successful blockchain submission
      const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      const submissionId = (content['id'] as string) || Math.random().toString(36).substring(7);
      
      const result: BlockchainSubmission = {
        id: submissionId,
        hash: mockHash,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      };

      this.submissions.update(prev => [...prev, result]);
      console.log('Content successfully archived on blockchain:', result);
      return result;
    } catch (error) {
      console.error('Blockchain submission failed:', error);
      throw error;
    }
  }
}
