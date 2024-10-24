import  { Injectable } from '@angular/core';
import  axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'api.example.com'

  constructor() {}

  async getData(){
    try{
      const response = await axios.get(`${this.baseUrl}/data`);
      return response.data;
    } catch (error){
      console.error('Error al obtener los datos', error);
      throw error;
    }
  }
}
