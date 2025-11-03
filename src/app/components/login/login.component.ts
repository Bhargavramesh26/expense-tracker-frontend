import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ← ADD THIS LINE
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  name = '';
  errorMessage = '';
  isRegistering = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isRegistering) {
      this.authService.register(this.name, this.email, this.password).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.errorMessage = err.error.error || 'Registration failed'
      });
    } else {
      this.authService.login(this.email, this.password).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => this.errorMessage = err.error.error || 'Login failed'
      });
    }
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }
}