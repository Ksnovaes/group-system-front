export default async function fetchWithUserId(url: string, options: RequestInit = {}) {
    const userId = localStorage.getItem('user-id'); // Certifique-se de que o user-id está salvo no localStorage
    if (!userId) {
      throw new Error('User ID is not available. Please ensure you are logged in.');
    }
  
    const headers = {
      ...options.headers,
      'user-id': userId,
      'Content-Type': 'application/json',
    };
  
    return fetch(url, { ...options, headers });
  }
  