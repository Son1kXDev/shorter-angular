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
  code: string = '';

  shorter = new FormGroup({
    inputURL: new FormControl<string>('', [Validators.required]),
  });
  toastrService = inject(ToastrService);
  api = inject(ApiService);

  get inputURL() {
    return this.shorter.controls.inputURL as FormControl;
  }

  onSubmitForm() {
    if (this.inputURL.hasError('required')) {
      this.toastrService.error('Требуется указать ссылку');
      return;
    }

    if (!URL.canParse(this.inputURL.value)) {
      this.toastrService.error('Недопустимая ссылка');
      return;
    }

    this.isLoading = true;

    this.api.generateUrl(this.inputURL.value).subscribe(
      (data) => {
        this.code = data;
        this.shortLink =
          window.location.href.replace(/(https?):\/\//, '') + this.code;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toastrService.error('Не удалось сгенерировать короткую ссылку');
        console.error(error);
      },
    );
  }

  clear() {
    this.shortLink = '';
    this.code = '';
    this.isLoading = false;
    this.inputURL.reset();
  }

  copy() {
    navigator.clipboard
      .writeText(this.shortLink)
      .then(() => {
        this.toastrService.success('Ссылка скопированна в буфер обмена');
      })
      .catch((Error) => {
        this.toastrService.error(
          'Не удалось скопировать ссылку в буфер обмена',
        );
        console.error(Error);
      });
  }
}
