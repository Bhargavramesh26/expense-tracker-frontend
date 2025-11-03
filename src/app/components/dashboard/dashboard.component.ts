import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService, Expense } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],  // ← ADD THIS LINE
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  stats: any = {};
  showAddForm = false;
  editingExpense: Expense | null = null;
  
  newExpense: Expense = {
    title: '',
    amount: 0,
    category: 'Food',
    date: new Date(),
    description: ''
  };

  categories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExpenses();
    this.loadStats();
  }

  loadExpenses() {
    this.expenseService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  loadStats() {
    this.expenseService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  openAddForm() {
    this.showAddForm = true;
    this.editingExpense = null;
    this.newExpense = {
      title: '',
      amount: 0,
      category: 'Food',
      date: new Date(),
      description: ''
    };
  }

  editExpense(expense: Expense) {
    this.editingExpense = expense;
    this.newExpense = { ...expense };
    this.showAddForm = true;
  }

  saveExpense() {
    if (this.editingExpense && this.editingExpense._id) {
      this.expenseService.updateExpense(this.editingExpense._id, this.newExpense).subscribe(() => {
        this.loadExpenses();
        this.loadStats();
        this.closeForm();
      });
    } else {
      this.expenseService.createExpense(this.newExpense).subscribe(() => {
        this.loadExpenses();
        this.loadStats();
        this.closeForm();
      });
    }
  }

  deleteExpense(id: string) {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe(() => {
        this.loadExpenses();
        this.loadStats();
      });
    }
  }

  closeForm() {
    this.showAddForm = false;
    this.editingExpense = null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}