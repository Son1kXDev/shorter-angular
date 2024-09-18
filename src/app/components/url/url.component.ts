import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
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

  url$: Observable<string> = new Observable<string>();
  code: string | null = '';

  service = inject(ApiService);

  ngOnInit(): void {
    this.url$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.code = params.get('code');
        return this.service.getUrl(this.code as string);
      }),
    );
  }
}
