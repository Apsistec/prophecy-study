import { Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, debounceTime, map } from 'rxjs';

export interface Message {
  id: string;
  page: number;
  row: number;
  link: string;
  location: string;
  date: Date;
  paragraphs: string[];
  isFavorite: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public messages: Message[] = [];
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private selectedMessageSubject = new BehaviorSubject<Message | null>(null);
  selectedMessage$ = this.selectedMessageSubject.asObservable();


  private favoriteUpdatesSubject = new Subject<{
    messageId: string;
    status: boolean;
  }>();
  favorites$ = this.favoriteUpdatesSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.favoriteUpdatesSubject
      .pipe(debounceTime(500))
      .subscribe(async ({ messageId, status }) => {
        try {
          const messageRef = doc(this.firestore, 'prophecies', messageId);
          const docSnap = await getDoc(messageRef);
          if (!docSnap.exists()) {
            console.error('Document does not exist:', messageId);
            return;
          }
          console.log('Updating document:', messageId);
          await updateDoc(messageRef, {
            isFavorite: status,
            lastModified: serverTimestamp(),
          });
          console.log('Successfully updated document');
        } catch (error) {
          console.error('Failed to update favorite status:', error);
          console.log('Attempted to update message:', {
            messageId,
            status,
            collection: 'prophecies',
          });
        }
      });
  }

  toggleFavorite(messageId: string, newStatus: boolean) {
    if (!messageId) {
      console.error('Cannot toggle favorite: Invalid message ID');
      return;
    }
    // Update local state for immediate UI feedback
    this.updateLocalFavoriteStatus(messageId, newStatus);
    // Queue the Firestore update
    this.favoriteUpdatesSubject.next({ messageId, status: newStatus });
  }

  private updateLocalFavoriteStatus(messageId: string, isFavorite: boolean) {
    // Update messages list
    const currentMessages = this.messagesSubject.value;
    if (currentMessages?.length) {
      const updatedMessages = currentMessages.map((message) =>
        message.id === messageId ? { ...message, isFavorite } : message
    );
    this.messagesSubject.next(updatedMessages);
  }
  
  // Update selected message if it's the one being modified
  const selectedMessage = this.selectedMessageSubject.value;
  if (selectedMessage && selectedMessage.id === messageId) {
    this.selectedMessageSubject.next({ ...selectedMessage, isFavorite });
  }
}


public getMessages(): Observable<Message[]> {
  const messagesRef = collection(this.firestore, 'prophecies');
  return collectionData(messagesRef, { idField: 'id' }) as Observable<
  Message[]
  >;
}

public getFavoriteMessages(parameter: boolean): Observable<Message[]> {
  const messagesRef = collection(this.firestore, 'prophecies');
  const propheciesQuery = query(
    messagesRef,
    where('isFavorite', '==', parameter)
  );
  return collectionData(propheciesQuery, { idField: 'id' }) as Observable<
  Message[]
  >;
}

setSelectedMessage(message: Message) {
  console.log(message.id)
  this.selectedMessageSubject.next(message);
  }
}
