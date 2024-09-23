import { test, expect } from "@playwright/test";

test("init page", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/frontend/public/");
  await expect(page).toHaveTitle("Gestion des Utilisateurs");
});

test("create a user", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/frontend/public/");
  await page.getByRole("button", { name: "Add user" }).click();
  await page.getByLabel("Nom :", { exact: true }).click();
  await page.getByLabel("Nom :", { exact: true }).fill("test playwight");
  await page.getByLabel("Prénom :").click();
  await page.getByLabel("Prénom :").fill("firstname");
  await page.getByLabel("Date de naissance :").fill("1989-01-11");
  await page
    .getByLabel("Photo (File) :")
    .setInputFiles("./tests/e2e/data/thispersondoesnotexist.jpg");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(
    await page.locator("tr:last-child > td:nth-child(2)").innerText()
  ).toBe("test playwight");
  await expect(
    await page.locator("tr:last-child > td:nth-child(3)").innerText()
  ).toBe("firstname");
  await expect(
    await page.locator("tr:last-child > td:nth-child(4)").innerText()
  ).toBe("Wed Jan 11 1989");
});

test("place nose", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/frontend/public/");
  await page
    .getByRole("row", { name: "test playwight firstname" })
    .locator("#localize")
    .click();
  await page.locator("canvas").click({
    position: {
      x: 272,
      y: 294,
    },
  });
  await page.getByRole("button", { name: "Confirm" }).click();
  await page
    .getByRole("row", { name: "test playwight firstname" })
    .locator("#view")
    .click();
  await expect(await page.getByText('X:').innerText()).toBe('X: 274, Y: 295');
});

test("delete a user", async ({ page }) => {
  await page.goto("http://127.0.0.1:8080/frontend/public/");
  await page
    .getByRole("row", { name: "test playwight firstname" })
    .locator("#delete")
    .click();
  await page.getByRole("button", { name: "Yes" }).click();
  await page.goto("http://127.0.0.1:8080/frontend/public/");
  await expect(await page.locator("tr").innerHTML()).toBe(`
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">First name</th>
              <th scope="col">Birth date</th>
              <th scope="col">Last update date</th>
              <th scope="col">Actions</th>
            `);
});
