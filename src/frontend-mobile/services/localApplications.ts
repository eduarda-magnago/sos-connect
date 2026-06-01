import * as SecureStore from 'expo-secure-store';

const STORAGE_KEY = 'sos-local-applications';
let memoryApplications: LocalApplication[] = [];

export type LocalApplicationType = 'mission' | 'donation';

export type LocalApplication = {
  id: string;
  type: LocalApplicationType;
  itemId: string;
  title: string;
  unitId: string;
  unitName: string;
  applicantUserId: string;
  applicantName: string;
  applicantEmail: string;
  availableOnSchedule: boolean;
  status: 'pending';
  createdAt: string;
};

export type SaveLocalApplicationInput = Omit<LocalApplication, 'id' | 'status' | 'createdAt'>;

export async function getLocalApplications(): Promise<LocalApplication[]> {
  let stored: string | null = null;

  try {
    stored = await SecureStore.getItemAsync(STORAGE_KEY);
  } catch {
    return memoryApplications;
  }

  if (!stored) return memoryApplications;

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return memoryApplications;

    memoryApplications = parsed;
    return parsed;
  } catch {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEY);
    } catch {
      return memoryApplications;
    }
    return memoryApplications;
  }
}

export async function saveLocalApplication(input: SaveLocalApplicationInput) {
  const applications = await getLocalApplications();
  const existingIndex = applications.findIndex(
    (application) =>
      application.type === input.type &&
      application.itemId === input.itemId &&
      application.applicantUserId === input.applicantUserId,
  );

  const next: LocalApplication = {
    ...input,
    id: `${input.type}-${input.itemId}-${input.applicantUserId}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    applications[existingIndex] = next;
  } else {
    applications.unshift(next);
  }

  memoryApplications = applications;

  try {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(applications));
  } catch {
    // Keep the application available during the current app session.
  }

  return next;
}
