// Add this in a separate file or at the top of App component
export const syncSessionAcrossTabs = () => {
    window.addEventListener('storage', (event) => {
      if (event.key === 'supabase.auth.token') {
        window.location.reload();
      }
    });
  };