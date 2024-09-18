import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NgIf} from "@angular/common";
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isLoading = false;
  shortLink = '';

  onSubmitForm(){
  }

  ngOnInit(): void {
  }
}
