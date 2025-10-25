import { Page } from '@playwright/test';

// Function to perform login
export const login = async (page: Page, url: any, email: string, password: string) => {
  await page.goto(url);
  // Fill in login form
  await page.fill('input[name="email"]', email || '');
  await page.fill('input[name="password"]', password || '');
  // Submit the form
  await page.click('button[type="submit"]');
};

// Function to generate a random password
export function generateRandomPassword(length: number = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
}

// Function to generate a random email modifier
export function generateRandomEmailModifer(): string {
  return `${process.env.EMAIL || ''}+${Date.now()}${Math.floor(Math.random() * 1000)}@childmind.org`;
}