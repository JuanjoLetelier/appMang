import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';
import { LanguageService } from 'src/app/services/language.service';

import { TimezoneService } from 'src/app/services/timezone.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  languageSvc = inject(LanguageService);
  selectedLanguage = '';

  timezoneData: any;
  currentTime: string = ''


  products: Product[] = [];
  loading: boolean = false;

  intervalId: any;
  
  async ngOnInit() {

    // ===== Obtener Lenguaje =====
    this.selectedLanguage = localStorage.getItem('language') as string;


    // ===== Coordenadas zona horaria =====

    const lat = -33.4489; // Latitud de ejemplo
    const lng = -70.6693; // Longitud de ejemplo
    const timestamp = Math.floor(Date.now() / 1000); // Timestamp actual en segundos

    try {
      this.timezoneData = await this.timezoneService.getTimeZone(lat, lng, timestamp);
      console.log('Datos de la zona horaria:', this.timezoneData);
      if (this.timezoneData){
        this.updateCurrentTime();
      }      
    } catch (error) {
      console.error('Error al obtener los datos de la zona horaria:', error);
    }

    this.intervalId = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  updateCurrentTime() {
    if(this.timezoneData){
      const offset = this.timezoneData.gmtOffset;
      const currentDate = new Date((Date.now() / 1000 + offset) * 1000);
      this.currentTime = currentDate.toLocaleTimeString();
    }
    
  
  }

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter(){
    this.getProducts();
  }

  doRefresh(event) {    
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  //============ Cambiar idioma
  setLanguage(){
    this.languageSvc.setLanguage(this.selectedLanguage)
  }

  //============ Cerrar sesion
  //getViews(){
    //return this.products.reduce((index, product))
  //}  


  
  //============ Obtener Productos

  getProducts() {
    let path = `users/${this.user().uid}/products`;

    this.loading = true;

    let query = (
      orderBy('views', 'desc')
    )

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;

        this.loading = false;

        sub.unsubscribe();
      }
    })
  }
  //============ Agregar o actualizar Manga

  async addUpdateProduct(product?: Product){

    let success = await this.utilsSvc.presentModal({
        component: AddUpdateProductComponent,
        cssClass: 'add-update-modal',
        componentProps:{ product }
      })

      if (success) this.getProducts();
  }

//============ Confirmar eliminación del producto  

async confirmDeleteProduct(product: Product) {
this.utilsSvc.presentAlert({
    header: 'Eliminar Manga',
    message: 'Estas Seguro que quieres eliminar este manga?',
    mode: 'ios',
    buttons: [
      {
        text: 'Cancelar',
      }, {
        text: 'Si, eliminar',
        handler: () => {
          this.deleteProduct(product)
        }
      }
    ]
  });

}

  // ===== Eliminar Producto =====

  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument( path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);


      this.utilsSvc.presentToast({
        message: 'Manga Eliminado Exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circule-outline',
      });

      })
      .catch((error) => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circule-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
}

// ===== Time Zone =====

  constructor(private timezoneService: TimezoneService) {}

}
