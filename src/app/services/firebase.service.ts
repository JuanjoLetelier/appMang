import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL } from 'firebase/storage'




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);


  //==================================================== Autenticacon ====================================================
  getAuth(){
    return getAuth();
  }

  //============ Acceder 
  sigIn(user: User){

    return signInWithEmailAndPassword(getAuth(),user.email,user.password)
  }

  //============Crear Usuario
  sigUp(user: User){

    return createUserWithEmailAndPassword(getAuth(),user.email,user.password)
  }

  //============ Actualizar Usuario

  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }

  //============ Enviar correo reset password

  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }

  //============ Cerrar sesion

  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  //==================================================== Base de Datos ====================================================

  //============ Obtener Documentos de una colección

  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path)
    return collectionData(query(ref, collectionQuery), {idField: 'id'});

  }

  //============ Actualizar Documento

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }


  //============ Obtener Documento

  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  //============ Agregar Documento

  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data);

  }

  //==================================================== Almacenamiento ====================================================

  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })

  }

}
