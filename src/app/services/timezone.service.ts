import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  private baseUrl = 'https://maps.googleapis.com/maps/api/timezone/json';

  constructor() {}

  async getTimezone(latitude: number, longitude: number, timestamp: number) {
    try {
      const response = await axios.get(`${this.baseUrl}?location=${latitude},${longitude}&timestamp=${timestamp}&key=AIzaSyBGe-BhXweyfPlQvrttQ7PZKgqR_yRTL0c`);
      console.log('Respuesta de la API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los datos de la zona horaria:', error);
      throw error;
    }
  }
}
