const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function toUrl(path: string): string {
	if (!API_BASE_URL) {
		return path;
	}

	return `${API_BASE_URL}${path}`;
}

export async function apiRequest<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const response = await fetch(toUrl(path), {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers || {}),
		},
	});

	if (!response.ok) {
		let message = 'Request failed';

		try {
			const data = (await response.json()) as { message?: string | string[] };
			if (Array.isArray(data.message)) {
				message = data.message.join(', ');
			} else if (data.message) {
				message = data.message;
			}
		} catch {
			message = response.statusText || message;
		}

		throw new Error(message);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return (await response.json()) as T;
}
