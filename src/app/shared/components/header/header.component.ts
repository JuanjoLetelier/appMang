import { ChangeDetectorRef, Component,inject,Input, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { TimezoneService } from 'src/app/services/timezone.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton!: string;
  @Input() isModal!: boolean;
  @Input() showMenu!: boolean;

  utilsSvc = inject(UtilsService);

  timezoneData: any;
  currentTime: string = ''
  localTime: string = ''
  localDate: string = ''

  intervalId: any;
  data: any;


  constructor (private timezoneService: TimezoneService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {



    try {
      const latitude = -33.0472;
      const longitude = -71.6127;
      const timestamp = Math.floor(new Date().getTime() / 1000);
      this.timezoneData = await this.timezoneService.getTimezone(latitude, longitude, timestamp);
      console.log('Datos de la zona horaria en el componente:', this.timezoneData);
      this.calculateLocalTime();
      this.intervalId = setInterval(() =>{
        this.calculateLocalTime();
        this.cdr.detectChanges();
      }, 1000);
      
    } catch (error) {
      console.error('Error al cargar datos de la zona horaria:', error);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  calculateLocalTime() {
    if (this.timezoneData) {
      // Obtener la hora actual en UTC en milisegundos
      const currentUtcTime = new Date().getTime();

      // Crear un objeto Date con la hora local usando el timeZoneId
      const localDate = new Date(currentUtcTime);
      this.localTime = localDate.toLocaleTimeString('es-CL', { timeZone: this.timezoneData.timeZoneId, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false });
      this.localDate = localDate.toLocaleDateString('es-CL', { timeZone: this.timezoneData.timeZoneId,weekday:'long', year: 'numeric', month: 'numeric', day: 'numeric' });
    }
  }

  dismissModal(){
    this.utilsSvc.dismissModal();
  }

}
