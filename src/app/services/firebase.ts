import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, Firestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, getDocFromServer, QueryConstraint } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private readonly platformId = inject(PLATFORM_ID);
  private app!: ReturnType<typeof initializeApp>;
  public auth!: Auth;
  public db!: Firestore;
  
  user = signal<User | null>(null);
  loading = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app, firebaseConfig.firestoreDatabaseId);
      this.testConnection();
      onAuthStateChanged(this.auth, (user) => {
        this.user.set(user);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }

  async testConnection() {
    try {
      await getDocFromServer(doc(this.db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
      }
    }
  }

  handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: this.auth.currentUser?.uid,
        email: this.auth.currentUser?.email,
        emailVerified: this.auth.currentUser?.emailVerified,
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  async login() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  async logout() {
    await signOut(this.auth);
  }

  // Generic Firestore helpers
  async getCollection(path: string, queries: QueryConstraint[] = []) {
    try {
      const q = query(collection(this.db, path), ...queries);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      this.handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  }

  async getDocument(path: string, id: string) {
    try {
      const d = await getDoc(doc(this.db, path, id));
      return d.exists() ? { id: d.id, ...d.data() } : null;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.GET, `${path}/${id}`);
      return null;
    }
  }

  async createDocument(path: string, data: Record<string, unknown>, id?: string) {
    try {
      const docRef = id ? doc(this.db, path, id) : doc(collection(this.db, path));
      await setDoc(docRef, { ...data, createdAt: new Date().toISOString() });
      return docRef.id;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.CREATE, path);
      return null;
    }
  }

  async updateDocument(path: string, id: string, data: Record<string, unknown>) {
    try {
      await updateDoc(doc(this.db, path, id), { ...data, updatedAt: new Date().toISOString() });
    } catch (error) {
      this.handleFirestoreError(error, OperationType.UPDATE, `${path}/${id}`);
    }
  }

  async deleteDocument(path: string, id: string) {
    try {
      await deleteDoc(doc(this.db, path, id));
    } catch (error) {
      this.handleFirestoreError(error, OperationType.DELETE, `${path}/${id}`);
    }
  }
}
