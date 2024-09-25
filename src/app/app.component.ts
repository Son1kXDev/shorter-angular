import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  isLoading = false;
  shortLink = '';

  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

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
      this.showError('URL is required');
      return;
    }

    if (!URL.canParse(this.inputURL.value)) {
      this.showError('Invalid URL');
      return;
    }
    this.isLoading = true;

    this.api.generateUrl(this.inputURL.value).subscribe(
      (data) => {
        this.shortLink = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.showError('Failed to generate short URL');
        console.error(error);
      },
    );
  }

  ngOnInit(): void {}
}
