import path from "path";
import { test, expect } from "../fixtures/TestBase.js";
import registeredUsers from "../test-data/registeredUsers.json";
import { step } from "../utils/testStepHelper.js";

let user: any;

// Increase timeout for slow UI
test.setTimeout(60000);

test.describe("Add to cart test", () => {

  test.beforeEach(async ({ homePage, actionHelper, loginPage, componentsPage }) => {
    await step("Navigate to home page and login", async () => {
      await actionHelper.navigateToFullUrl("/index.php?route=common/home");

      await homePage.hoverMyAccountMenu();
      await homePage.clickLoginLink();

      user = registeredUsers[0];
      if (!user?.email || !user?.password)
        throw new Error("Invalid or missing user data in JSON");

      await loginPage.login(user.email, user.password);
    });

    await step("Ensure cart is empty before test", async () => {
      await componentsPage.emptyCartIfNeeded();
    });
  });

  // -------------------------------
  //      TEST 1: ADD ONE ITEM
  // // -------------------------------
  test("Add to cart", async ({ componentsPage, homePage }) => {

    await step("Navigate to Palm Treo Pro", async () => {
      await homePage.hoverMegaMenu();
      await homePage.clickHeadphonesCategory();
      await componentsPage.scrollToViewPalmTreoPro();
      await componentsPage.hoverToPalmTreoProImage();
    });

    await step("Add item to cart", async () => {
      await componentsPage.clickAddToCart("Palm Treo Pro");
    });

    await step("Verify success popup", async () => {
      const palmTreoPrice = await componentsPage.getPalmTreoProPriceValue();
      await componentsPage.verifyCartSummary(1, palmTreoPrice);
    });
  });

  // // -------------------------------
  // //      TEST 2: ADD TWO ITEMS
  // // -------------------------------
  test("Add two items to cart", async ({ componentsPage, homePage }) => {

    await step("Navigate to Palm Treo Pro", async () => {
      await homePage.hoverMegaMenu();
      await homePage.clickHeadphonesCategory();
      await componentsPage.scrollToViewPalmTreoPro();
      await componentsPage.hoverToPalmTreoProImage();
    });

    await step("Click Add to Cart twice", async () => {
      await componentsPage.clickAddToCart("Palm Treo Pro");
      await componentsPage.clickAddToCart("Palm Treo Pro");
    });

    await step("Verify cart summary for 2 items", async () => {
      const calculatedTotal = await componentsPage.calculatedItemsInCart();
      await componentsPage.verifyAlertPopUpSuccessTextForTwoItems(2, calculatedTotal);
    });
  });

});
