import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { GroceriesServiceService } from './../groceries-service.service';
import { InputDialogServiceService } from './../input-dialog-service.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  pageTitle = "Grocery List";

  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastController: ToastController, public alertController: AlertController, public dataService: GroceriesServiceService, public inputDialogService: InputDialogServiceService, public socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });

  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
  }

  async removeItem(id) {
    this.dataService.removeItem(id);
  }

  async shareItem(item) {
    console.log("Sharing Item - ", item);
    const toast = await this.toastController.create({
      message: "Sharing Item - " + item.name + " ...",
      duration: 3000
    });
    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch((error) => {
      // Sharing via email is not possible
      console.error("Error while sharing ", error);
    });

  }

  async editItem(item, index) {
    console.log("Editing Item - ", item, index);
    const toast = await this.toastController.create({
      message: "Editing Item - " + index + " ...",
      duration: 3000
    });
    toast.present();

    this.inputDialogService.showPrompt(item, index);

  }

  async addItem() {
    console.log("Adding Item");
    this.inputDialogService.showPrompt();
  }
}


