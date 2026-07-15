import { getCurrentUser, requirePermission } from '@kirana/auth';

export default async function ProtectedPage() {
  // Example of retrieving session and asserting permissions
  const user = await getCurrentUser();
  await requirePermission('platform:view', 'system');

  return (
    <div>
      <h1>Protected Area</h1>
      <p>Welcome, {user.name || user.email}</p>
    </div>
  );
}
