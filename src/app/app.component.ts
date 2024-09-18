import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  formBuilder = inject(FormBuilder);

  shorter = this.formBuilder.group({
    inputURL: ['', [Validators.required, Validators.pattern(this.reg)]],
  });

  toastrService = inject(ToastrService);

  showError() {
    this.toastrService.error('Invalid URL');
  }

  onSubmitForm() {}

  ngOnInit(): void {}
}
