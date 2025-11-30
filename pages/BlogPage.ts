import { Page, expect } from '@playwright/test';
import { ActionHelper } from '../utils/ActionHelper.js';

export default class ChangePassword {
    private page: Page;                 // Playwright page object for browser interactions
    private actionHelper: ActionHelper; // Helper for common actions like click, type, wait, verify 
    constructor(page: Page, actionHelper: ActionHelper) {
        this.page = page;
        this.actionHelper = actionHelper;
    }

    // ------------------------------
    // Locators
    // ------------------------------
    private commentInput = '#input-comment';
    private postCommentButton = '#button-comment';
    private successText = 'alert.alert-success.alert-dismissible';
    private yourNameInput = '#input-name';
    private yourEmailInput = '#input-email';
    private yourCommentInput = '#input-comment';
    private nameErrorMessage = '.invalid-feedback';   
    private emailErrorMessage = '.invalid-feedback';
    private commentErrorMessage = '.invalid-feedback';
    private blogLinkLocator = 'span.title';


    // ------------------------------
    async clickBlogLink() {

        const blogLink = this.page.locator(this.blogLinkLocator, { hasText: "Blog" }).nth(1);
        await this.actionHelper.click(
            blogLink, "Click Blog Link");
    }

    async verifyNameErrorMessage(expectedMessage: string) {
        const nameErrorMessage = this.page.locator(this.nameErrorMessage).nth(0);
        await this.actionHelper.verifyText(
            nameErrorMessage, expectedMessage, 'Name Error Message');
    }

    async verifyEmailErrorMessage(expectedMessage: string) {
        const emailErrorMessage = this.page.locator(this.emailErrorMessage).nth(1);
        await this.actionHelper.verifyText(emailErrorMessage, expectedMessage, 'Email Error Message');
    }

    async verifyCommentErrorMessage(expectedMessage: string) {
        const commentErrorMessage = this.page.locator(this.commentErrorMessage).nth(2);
        await this.actionHelper.verifyText(
            commentErrorMessage, expectedMessage, 'Comment Error Message');
    }

    async fillYourName(name: string) {
        await this.actionHelper.type(
            this.yourNameInput, name, "Your Name Input Field");
    }

    async fillYourEmail(email: string) {
        await this.actionHelper.type(
            this.yourEmailInput, email, "Your Email Input Field");
    }

    async fillYourComment(comment: string) {
        await this.actionHelper.type(
            this.yourCommentInput, comment, "Your Comment Input Field");
    }

    async scrollToLaptopImage() {
        await this.page.getByAltText(
            "amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus").
            first().scrollIntoViewIfNeeded();
    }

    async clickLaptopImage() {
        await this.page.getByAltText(
            "amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus")
            .first().click();
    }


    async fillCommentDetails(comment: string) {
        await this.actionHelper.type(
            this.commentInput, comment, "Comment Input Field");
    }

    async clickPostCommentButton() {
        await this.actionHelper.click(
            this.postCommentButton, 'Post Comment Button');
    }


    async verifyBlogPageLoaded(expectedTitle: string) {
        const actualTitle = await this.page.title();
        expect(actualTitle).toBe(expectedTitle);
    }

    async verifyBlogCommentSuccessMessage(expectedMessage: string) {
        await this.actionHelper.verifyText(
            `.${this.successText}`, expectedMessage, 'Blog Comment Success Message');
    }
}