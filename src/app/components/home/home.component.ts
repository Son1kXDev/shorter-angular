import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { RouterOutlet } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AutosizeModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  isLoading = false;
  shortLink = '';

  shorter = new FormGroup({
    inputURL: new FormControl<string>('', [Validators.required]),
  });
  toastrService = inject(ToastrService);
  api = inject(ApiService);

  get inputURL() {
    return this.shorter.controls.inputURL as FormControl;
  }

  showError(msg: string) {
    this.toastrService.error(msg);
  }

  onSubmitForm() {
    if (this.inputURL.hasError('required')) {
      this.showError('Требуется указать ссылку');
      return;
    }

    if (!URL.canParse(this.inputURL.value)) {
      this.showError('Недопустимая ссылка');
      return;
    }

    this.isLoading = true;

    this.api.generateUrl(this.inputURL.value).subscribe(
      (data) => {
        this.shortLink = window.location.href + data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.showError('Не удалось сгенерировать короткую ссылку');
        console.error(error);
      },
    );
  }

  clear() {
    this.shortLink = '';
    this.isLoading = false;
    this.inputURL.reset();
  }

  copy() {
    navigator.clipboard.writeText(this.shortLink);
    this.toastrService.success('Ссылка скопированна в буфер обмена');
  }
}
