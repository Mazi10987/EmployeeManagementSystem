import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private hubConnection?: signalR.HubConnection;

  constructor() { }

  startConnection() {

    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl('https://localhost:7200/notificationHub')

      .withAutomaticReconnect()

      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error(err));

  }

  onEmployeeCreated(callback: (employeeName: string) => void) {

    this.hubConnection?.on(
      'EmployeeCreated',
      callback
    );

  }

}