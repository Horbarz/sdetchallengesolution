import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Homepage Sanity', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigate();
  });

  test('Contact form is visible on the homepage', async () => {
    await homePage.assertContactFormVisible();
  });

  test('Book this room buttons are present for all room types', async () => {
    await homePage.assertBookNowButtonsPresent(['Single', 'Double', 'Suite']);
  });
});