import { OverlayToaster } from '@blueprintjs/core';

export const toasterPromise = OverlayToaster.createAsync({
  position: 'top',
});

export async function showToast(
  message: string,
  intent: 'none' | 'primary' | 'success' | 'warning' | 'danger' = 'none'
) {
  const toaster = await toasterPromise;
  toaster.show({ message, intent, timeout: 3000 });
}
