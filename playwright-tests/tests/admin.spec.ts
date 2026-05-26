import { test, expect } from '@playwright/test';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME!;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

test.describe('Admin Authentication & Dashboard', () => {
  let loginPage: AdminLoginPage;
  let dashboardPage: AdminDashboardPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new AdminLoginPage(page);
    dashboardPage = new AdminDashboardPage(page);
    await loginPage.navigate();
  });

  test('Admin can log in and is redirected to the dashboard', async () => {
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await dashboardPage.assertOnDashboard();
  });

  test('Logout button is visible after login', async () => {
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await dashboardPage.assertLogoutButtonVisible();
  });

  test('Rooms tab shows room details matching the public homepage', async ({ page }) => {
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await dashboardPage.assertOnRoomsPage();
    await dashboardPage.assertRoomExists('Single', '100');
    await dashboardPage.assertRoomExists('Double', '150');
    await dashboardPage.assertRoomExists('Suite', '225');
  });
});