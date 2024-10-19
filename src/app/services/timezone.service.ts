import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TimezoneService {
  private apiKey: string = 'AIzaSyBGe-BhXweyfPlQvrttQ7PZKgqR_yRTL0c';
  private baseUrl: string = 'https://maps.googleapis.com/maps/api/timezone/json';

  constructor() {}

  async getTimeZone(lat: number, lng: number, timestamp: number) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          location: `${lat},${lng}`,
          timestamp: timestamp,
          key: this.apiKey,
        },
      });
      console.log('Respuesta de la API:', response.data); // Verifica los datos aquí
      return response.data;
    } catch (error) {
      console.error('Error al obtener la zona horaria:', error);
      throw error;
    }
  }
}