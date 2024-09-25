import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-url',
  standalone: true,
  imports: [],
  templateUrl: './url.component.html',
  styleUrl: './url.component.css',
})
export class UrlComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(ApiService);

  ngOnInit(): void {
    this.service
      .getURL(this.route.snapshot.paramMap.get('code') as string)
      .subscribe({
        next: (url) => {
          window.location.href = url;
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/']);
        },
      });
  }
}
