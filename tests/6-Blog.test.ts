import path from "path";
import { test, expect } from "../fixtures/TestBase.js";
import registeredUsers from "../test-data/registeredUsers.json";
import { step } from "../utils/testStepHelper.js";

let user: any;

// Increase timeout for slow UI
test.setTimeout(60000);

test.describe("Blog Page Tests", () => {

    test.beforeEach(async ({ actionHelper }) => {
        await step("Navigate to home page and login", async () => {
            await actionHelper.navigateToFullUrl("/index.php?route=common/home");
            user = registeredUsers[0];
            if (!user?.email || !user?.password)
                throw new Error("Invalid or missing user data in JSON");
        });
    });

    test.describe("Add Blog positive tests while user is logged in", () => {
        test("Verifying add blog success when logged in", async ({ blogPage, homePage, loginPage }) => {
            await step("Hover My Account menu and click Login link", async () => {
                await homePage.hoverMyAccountMenu();
            });

            await step("Login with registered user", async () => {
                await homePage.clickLoginLink();
            });

            await step("Perform login", async () => {

                await loginPage.login(user.email, user.password);
            });

            await step("Navigate to Blog page", async () => {
                await blogPage.clickBlogLink();
            });
            await step("Scroll to laptop image and click", async () => {
                await blogPage.scrollToLaptopImage();
            });
            await step("Click laptop image", async () => {
                await blogPage.clickLaptopImage();
            });

            const commentText = "This is a test comment from Playwright automation.";

            await step("Fill comment details", async () => {
                await blogPage.fillCommentDetails(commentText);
            });

            await step("Click Post Comment button", async () => {
                await blogPage.clickPostCommentButton();
            });

            await step("Verify blog page loaded", async () => {
                await blogPage.verifyBlogPageLoaded("amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus");
            });

            await step("Verify blog comment success message", async () => {
                await blogPage.verifyBlogCommentSuccessMessage("Thank you for your comment. It has been submitted to the webmaster for approval.");
            });
        });
    });

    test.describe("Add Blog positive tests while user is NOT logged in", () => {

        test("Verifying add blog success message", async ({ blogPage }) => {
            await step("Navigate to Blog page", async () => {
                await blogPage.clickBlogLink();
            });

            await step("Scroll to laptop image", async () => {
                await blogPage.scrollToLaptopImage();
            });

            await step("Click laptop image", async () => {
                await blogPage.clickLaptopImage();
            });
            await step("Fill Your Name", async () => {
                await blogPage.fillYourName(user.firstName + " " + user.lastName);
            });
            await step("Fill Your Email", async () => {
                await blogPage.fillYourEmail(user.email);
            });
            await step("Fill Your Comment", async () => {
                const commentText = "This is a test comment from Playwright automation.";
                await blogPage.fillYourComment(commentText);
            });

            await step("Click Post Comment button", async () => {
                await blogPage.clickPostCommentButton();
            });

            await step("Verify blog page loaded", async () => {
                await blogPage.verifyBlogPageLoaded("amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus");
            });
            await step("Verify blog comment success message", async () => {
                await blogPage.verifyBlogCommentSuccessMessage("Thank you for your comment. It has been submitted to the webmaster for approval.");
            });
        });
    });

    test.describe("Add Blog negative tests while user is NOT logged in", () => {
        test("Verifying add blog error message when name is missing", async ({ blogPage }) => {
            await step("Navigate to Blog page", async () => {
                await blogPage.clickBlogLink();
            });
            await step("Scroll to laptop image", async () => {
                await blogPage.scrollToLaptopImage();
            });
            await step("Click laptop image", async () => {
                await blogPage.clickLaptopImage();
            });

            await step("Fill Your Email", async () => {
                await blogPage.fillYourEmail(user.email);
            });
            await step("Fill Your Comment", async () => {
                const commentText = "This is a test comment from Playwright automation.";
                await blogPage.fillYourComment(commentText);
            });

            await step("Click Post Comment button", async () => {
                await blogPage.clickPostCommentButton();
            });
            await step("Verify name error message", async () => {
                await blogPage.verifyNameErrorMessage("Warning: Comment Name must be between 3 and 25 characters!");
            });
        });

        test("Verifying add blog error message when email is invalid", async ({ blogPage }) => {
            await step("Navigate to Blog page", async () => {
                await blogPage.clickBlogLink();
            });
            await step("Scroll to laptop image", async () => {
                await blogPage.scrollToLaptopImage();
            });
            await step("Click laptop image", async () => {
                await blogPage.clickLaptopImage();
            });
            await step("Fill Your Name", async () => {
                await blogPage.fillYourName(user.firstName + " " + user.lastName);
            });
            await step("Fill Your Email with invalid email", async () => {
                await blogPage.fillYourEmail("invalid-email-format");
            });
            await step("Fill Your Comment", async () => {
                const commentText = "This is a test comment from Playwright automation.";
                await blogPage.fillYourComment(commentText);
            });

            await step("Click Post Comment button", async () => {
                await blogPage.clickPostCommentButton();
            });
            await step("Verify email error message", async () => {
                await blogPage.verifyEmailErrorMessage("Warning: Invalid email id!");
            });
        });
        test("Verifying add blog error message when comment is missing", async ({ blogPage }) => {
            await step("Navigate to Blog page", async () => {
                await blogPage.clickBlogLink();
            });
            await step("Scroll to laptop image", async () => {
                await blogPage.scrollToLaptopImage();
            });
            await step("Click laptop image", async () => {
                await blogPage.clickLaptopImage();
            });
            await step("Fill Your Name", async () => {
                await blogPage.fillYourName(user.firstName + " " + user.lastName);
            });
            await step("Fill Your Email", async () => {
                await blogPage.fillYourEmail(user.email);
            });
            await step("Click Post Comment button", async () => {
                await blogPage.clickPostCommentButton();
            });
            await step("Verify comment error message", async () => {
                await blogPage.verifyCommentErrorMessage("Warning: Comment Text must be between 25 and 1000 characters!");
            });
        });
    });
});