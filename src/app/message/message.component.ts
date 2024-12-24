import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
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

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, DatePipe, IonButton, IonIcon],
})
export class MessageComponent {

  @Input() message?: Message;

  constructor(private messageService: MessageService) {
    addIcons({ chevronForward, heartOutline, heart });
  }

  desktop!: boolean;
  private platform = inject(Platform);

  ngOnInit() {
    if (this.platform.is('desktop')) {
      this.desktop = true;
    } else {
      this.desktop = false;
    }
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

    modal.onWillDismiss().then((result) => {
      // Check if we received any data
      if (result.data) {
        console.log('Modal sent back data:', result.data);
        // Handle the returned data
        if (result.data.isFavorite !== undefined) {
          // Update your local state or trigger a refresh
          this.messageService.toggleFavorite(
            result.data.id,
            result.data.isFavorite
          );
        }
      }
    });

    modal.present();
  }
}
