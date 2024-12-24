import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy  // Add this
} from '@angular/core';
import {
  Platform,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronForward, heart, heartOutline } from 'ionicons/icons';
import { MessageService, Message } from '../services/message.service';
import { DatePipe } from '@angular/common';
import { ProphecyModalComponent } from '../prophecy-modal/prophecy-modal.component';
import { Subscription } from 'rxjs';  // Add this

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, DatePipe, IonButton, IonIcon],
})
export class MessageComponent implements OnDestroy {  // Add OnDestroy
  desktop!: boolean;
  private platform = inject(Platform);
  private subscription: Subscription;  // Add this

  @Input() message?: Message;
  selectedMessage: Message | null = null;  // Keep this

  constructor(private messageService: MessageService) {
    addIcons({ chevronForward, heartOutline, heart });
    this.subscription = this.messageService.selectedMessage$.subscribe(
      message => this.selectedMessage = message
    );
  }

  ngOnInit() {
    if (this.platform.is('desktop')) {
      this.desktop = true;
    } else {
      this.desktop = false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectMessage(message: Message) {
    this.messageService.setSelectedMessage(message);
    if (!this.desktop) {
      this.openModal(message);
    }
  }

  toggleFavorite(event: Event, message: Message) {
    if (!message.id) {
      console.error('Message ID is required for toggling favorite status');
      return;
    }
    event.stopPropagation();
    const newStatus = !message.isFavorite;
    this.messageService.toggleFavorite(message.id, newStatus);
  }

  private modalCtrl = inject(ModalController);

  async openModal(message: Message) {
    const modal = await this.modalCtrl.create({
      component: ProphecyModalComponent,
      componentProps: {
        message: message,
      },
    });
    modal.present();
  }
}