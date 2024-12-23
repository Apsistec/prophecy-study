import { Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Message {
  page: number;
  row: number;
  link: string;
  location: string;
  date: Date;
  paragraphs: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public messages: Message[] = [];

  private selectedMessageSubject = new BehaviorSubject<Message | null>(null);
  selectedMessage$ = this.selectedMessageSubject.asObservable();

  constructor(private firestore: Firestore) { }

  public getMessages(): Observable<Message[]> {
    const messagesRef = collection(this.firestore, 'prophecies');
    return collectionData(messagesRef, {idField: 'id'}) as Observable<Message[]>
  }

  public getMessageById(id: number): Message {
    return this.messages[id];
  }
  
  setSelectedMessage(message: Message) {
    this.selectedMessageSubject.next(message);
  }
}
