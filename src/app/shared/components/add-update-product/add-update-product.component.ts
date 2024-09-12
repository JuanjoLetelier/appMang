import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    category: new FormControl('', [Validators.required, Validators.minLength(4)]),
    typology: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {  
    
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }


  // ===== Tomar/Seleccionar imagen =====

  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit() {
    if (this.form.valid) {

      let path = `users/${this.user.uid}/products`

      const loading = await this.utilsSvc.loading();
      await loading.present();

       // ===== Subir imagen y obtener url =====
       let dataUrl = this.form.value.image;
       let imagePath = `${this.user.uid}/${Date.now()}`;
       let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
       this.form.controls.image.setValue(imageUrl);

       delete this.form.value.id;

      this.firebaseSvc.addDocument( path, this.form.value).then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Manga agregado exitosamente',
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
  }

}
