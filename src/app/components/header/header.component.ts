import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public ipcService = inject(IpcService);

  public showIpcModal = false;
  public tempIpcValue: number = 0;

  public openIpcModal(): void {
    // Capture current IPC rate snapshot for draft editing
    this.tempIpcValue = this.ipcService.ipcRate();
    this.showIpcModal = true;
  }

  public closeIpcModal(): void {
    // Discard draft changes without saving
    this.showIpcModal = false;
  }

  public saveIpc(): void {
    // Commit draft IPC rate to service & LocalStorage
    const num = Number(this.tempIpcValue);
    if (!isNaN(num) && num >= 0) {
      this.ipcService.updateIpcRate(num, true);
    }
    this.showIpcModal = false;
  }
}
