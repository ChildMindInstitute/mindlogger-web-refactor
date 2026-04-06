import { test, expect } from '../../fixtures/test';
import { generateRandomUser } from '../../data/users';
import type { AppletsApi } from '../../api/applets.api';
import type { UsersApi } from '../../api/users.api';

async function createInviteForRandomUser(
  usersApi: UsersApi,
  appletsApi: AppletsApi,
  appletID: string
) {
  const user = generateRandomUser();
  const createdUser = await usersApi.createUser(user);
  expect(createdUser.result.email).toBe(user.email);

  const inviteData = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    language: 'en',
    role: 'manager',
    workspacePrefix: '',
    title: 'Manager Title',
  };

  const createdInvite = await appletsApi.createManagerInvite(inviteData, appletID);
  expect(createdInvite).toBeTruthy();

  const invitationId =
    createdInvite?.result?.id ||
    createdInvite?.id ||
    createdInvite?.result?.invitation?.id ||
    createdInvite?.invitationId ||
    createdInvite?.invitation?.id;

  expect(invitationId).toBeTruthy();

  return { user, invitationId: invitationId as string };
}

test.describe('User Invitations', () => {
  test('Create manager invite via API', async ({ appletsApi }) => {
    const appletID = process.env.TEST_APPLET_ID;
    test.skip(!appletID, 'Set TEST_APPLET_ID to run invite tests');

    const inviteData = {
      email: `automation${Date.now()}@example.com`,
      firstName: 'Automation',
      lastName: 'Test',
      language: 'en',
      role: 'manager',
      workspacePrefix: '',
      title: 'Manager Title',
    };

    const createdInvite = await appletsApi.createManagerInvite(inviteData, appletID!);
    expect(createdInvite).toBeTruthy();

    const invitations = await appletsApi.getAppletInvitations(appletID!);
    expect(invitations).toBeTruthy();
  });

  test('Accept an invite via API helper', async ({ appletsApi, invitationsApi, usersApi }) => {
    const appletID = process.env.TEST_APPLET_ID;
    test.skip(!appletID, 'Set TEST_APPLET_ID to run invite acceptance tests');

    const { invitationId } = await createInviteForRandomUser(usersApi, appletsApi, appletID!);

    const invitation = await invitationsApi.getInvitation(invitationId);
    expect(invitation.result.status).toBe('pending');

    await invitationsApi.acceptInvitation(invitationId);

    const acceptedInvitation = await invitationsApi.getInvitation(invitationId);
    expect(acceptedInvitation.result.status).toBe('approved');
  });

  test('Accept an invite through the browser invite route', async ({ appletsApi, invitationsApi, usersApi, loginPage, page, baseURL }) => {
    const appletID = process.env.TEST_APPLET_ID;
    test.skip(!appletID, 'Set TEST_APPLET_ID to run invite acceptance tests');

    const { user, invitationId } = await createInviteForRandomUser(usersApi, appletsApi, appletID!);

    await loginPage.goto(baseURL);
    await loginPage.login(user.email, user.password);

    await page.goto(`/invitation/${invitationId}`);
    const acceptButton = page.getByRole('button', { name: /accept invitation/i });
    await expect(acceptButton).toBeVisible();

    await acceptButton.click();
    await expect(page).toHaveURL(/\/protected\/applets/);

    const acceptedInvitation = await invitationsApi.getInvitation(invitationId);
    expect(acceptedInvitation.result.status).toBe('approved');
  });
});
