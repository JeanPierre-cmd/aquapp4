/**
 * Ligero wrapper sobre los endpoints backend `/api/aps/*`.
 * NO añade deps externas; usa fetch nativo.
 *
 * Flujo: auth → ensureBucket → upload → translate → (poll) manifest
 * Todos reciben/retornan JSON simple para mantener el acoplamiento mínimo.
 */

export interface AuthToken {
  access_token: string;
  expires_in: number; // seg
  token_type: 'Bearer';
  expiration: number; // unix epoch
}

export interface TranslationStatus {
  status: 'inprogress' | 'failed' | 'success';
  urn: string;
  progress?: string; // "25%" ...
  messages?: Array<{ level: string; text: string }>;
}

const API = '/api/aps';

async function jsonFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      \`APS request failed \${res.status} – \${res.statusText}: \${text}\`
    );
  }
  return (await res.json()) as T;
}

/* ---------- Public API ---------- */

export async function auth(): Promise<AuthToken> {
  return jsonFetch<AuthToken>(\`\${API}/auth\`, { method: 'POST' });
}

export async function ensureBucket(
  token: string,
  bucketKey: string
): Promise<void> {
  await jsonFetch(\`\${API}/bucket\`, {
    method: 'POST',
    headers: { Authorization: \`Bearer \${token}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucketKey })
  });
}

export async function uploadObject(
  token: string,
  bucketKey: string,
  objectName: string,
  file: File
): Promise<{ objectId: string }> {
  return jsonFetch(\`\${API}/upload?bucket=\${bucketKey}&amp;name=\${encodeURIComponent(
    objectName
  )}\`, {
    method: 'PUT',
    headers: { Authorization: \`Bearer \${token}\` },
    body: file
  });
}

export async function translateObject(
  token: string,
  urn: string,
  useSvf2 = true
): Promise<{ result: 'created' | 'exist' }> {
  return jsonFetch(\`\${API}/translate\`, {
    method: 'POST',
    headers: { Authorization: \`Bearer \${token}\`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      urn,
      format: useSvf2 ? 'svf2' : 'svf'
    })
  });
}

export async function getManifest(
  token: string,
  urn: string
): Promise<TranslationStatus> {
  return jsonFetch(\`\${API}/manifest/\${urn}\`, {
    headers: { Authorization: \`Bearer \${token}\` }
  });
}
