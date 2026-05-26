import { Page, Locator, expect } from '@playwright/test';

export class AdminDashboardPage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly roomsNavLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
    this.roomsNavLink = page.getByRole('link', { name: 'Rooms' });
  }

  async assertOnDashboard(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/inboxes/);
  }

  async assertLogoutButtonVisible(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
  }

  async assertOnRoomsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/admin\/rooms/);
  }

  async navigateToRooms(): Promise<void> {
    await this.roomsNavLink.click();
  }

  async assertRoomExists(roomType: string, price: string): Promise<void> {
    await expect(this.page.getByText(roomType, { exact: true }).first()).toBeVisible();
    await expect(this.page.getByText(price, { exact: true }).first()).toBeVisible();
  }
}