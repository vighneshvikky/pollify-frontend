import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PollMetadata } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll',
  imports: [FormsModule, CommonModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.scss',
})
export class PollComponent {
  @Input() isVisible: boolean = false;
  @Output() pollCreated = new EventEmitter<PollMetadata>();
  @Output() cancelled = new EventEmitter<void>();

  
  pollQuestion: string = '';
  pollOptions: string[] = ['', ''];
  allowMultiple: boolean = false;
  validationError: string = '';

  readonly MAX_QUESTION_LENGTH = 200;
  readonly MAX_OPTION_LENGTH = 100;
  readonly MAX_OPTIONS = 10;
  readonly MIN_OPTIONS = 2;

  get questionCharCount(): string {
    return `${this.pollQuestion.length}/${this.MAX_QUESTION_LENGTH}`;
  }

  get optionCount(): string {
    return `${this.pollOptions.length}/${this.MAX_OPTIONS}`;
  }

  get canAddOption(): boolean {
    return this.pollOptions.length < this.MAX_OPTIONS;
  }

  get canRemoveOption(): boolean {
    return this.pollOptions.length > this.MIN_OPTIONS;
  }

  addOption(): void {
    if (this.canAddOption) {
      this.pollOptions.push('');
      this.validationError = '';
    }
  }

  removeOption(index: number): void {
    if (this.canRemoveOption) {
      this.pollOptions.splice(index, 1);
      this.validationError = '';
    }
  }

  validatePoll(): boolean {
    this.validationError = '';

    // Validate question
    const question = this.pollQuestion.trim();
    if (!question) {
      this.validationError = 'Please enter a question for the poll';
      return false;
    }

    if (question.length > this.MAX_QUESTION_LENGTH) {
      this.validationError = `Question cannot exceed ${this.MAX_QUESTION_LENGTH} characters`;
      return false;
    }

    // Validate options
    const validOptions = this.pollOptions
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0);

    if (validOptions.length < this.MIN_OPTIONS) {
      this.validationError = `Please provide at least ${this.MIN_OPTIONS} options`;
      return false;
    }

    // Check for duplicate options
    const uniqueOptions = new Set(validOptions.map((opt) => opt.toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      this.validationError = 'Options must be unique';
      return false;
    }

    // Check option length
    const tooLongOption = validOptions.find(
      (opt) => opt.length > this.MAX_OPTION_LENGTH
    );
    if (tooLongOption) {
      this.validationError = `Options cannot exceed ${this.MAX_OPTION_LENGTH} characters`;
      return false;
    }

    return true;
  }

  createPoll(): void {
    if (!this.validatePoll()) {
      return;
    }

 const validOptions = this.pollOptions
  .map((opt) => opt.trim())
  .filter((opt) => opt.length > 0)
  .map((opt) => ({
    text: opt,
    votes: 0
  }));

const pollData: PollMetadata = {
  question: this.pollQuestion.trim(),
  options: validOptions, 
  allowMultiple: this.allowMultiple,
};


    this.pollCreated.emit(pollData);
    this.resetForm();
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  resetForm(): void {
    this.pollQuestion = '';
    this.pollOptions = ['', ''];
    this.allowMultiple = false;
    this.validationError = '';
  }

  trackByIndex(index: number): number {
    return index;
  }
}
