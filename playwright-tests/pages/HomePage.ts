import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly contactForm: Locator;
  readonly contactNameInput: Locator;
  readonly contactEmailInput: Locator;
  readonly contactPhoneInput: Locator;
  readonly contactSubjectInput: Locator;
  readonly contactMessageInput: Locator;
  readonly contactSubmitButton: Locator;
  readonly bookNowLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactForm = page.getByRole('heading', { name: 'Send Us a Message' });
    this.contactNameInput = page.getByTestId('ContactName');
    this.contactEmailInput = page.getByTestId('ContactEmail');
    this.contactPhoneInput = page.getByTestId('ContactPhone');
    this.contactSubjectInput = page.getByTestId('ContactSubject');
    this.contactMessageInput = page.getByTestId('ContactDescription');
    this.contactSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.bookNowLinks = page.locator('a.btn.btn-primary[href*="/reservation/"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
  }

  async assertContactFormVisible(): Promise<void> {
    await expect(this.contactForm).toBeVisible();
    await expect(this.contactNameInput).toBeVisible();
    await expect(this.contactEmailInput).toBeVisible();
    await expect(this.contactPhoneInput).toBeVisible();
    await expect(this.contactSubjectInput).toBeVisible();
    await expect(this.contactMessageInput).toBeVisible();
    await expect(this.contactSubmitButton).toBeVisible();
  }

  async assertBookNowButtonsPresent(expectedRoomTypes: string[]): Promise<void> {
    await expect(this.bookNowLinks.first()).toBeVisible({ timeout: 15000 });
    const count = await this.bookNowLinks.count();
    expect(count).toBeGreaterThanOrEqual(expectedRoomTypes.length);
    for (const roomType of expectedRoomTypes) {
      await expect(this.page.getByRole('heading', { name: roomType })).toBeVisible();
    }
  }
}