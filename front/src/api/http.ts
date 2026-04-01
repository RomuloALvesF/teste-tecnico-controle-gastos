// Cliente HTTP da API URL base no .env e leitura de erros incluindo validação do ASP.NET.
export type ApiError = {
  status: number
  title: string
  detail?: string
  errors?: Record<string, string[]>
}

function buildUrl(path: string) {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined
  if (!base) throw new Error('Defina VITE_API_BASE_URL no .env')
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`
}

async function parseApiError(res: Response): Promise<ApiError> {
  const contentType = res.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return { status: res.status, title: res.statusText || 'Erro', detail: await res.text() }
  }

  const json = (await res.json()) as any

  // Erro de validação do ASP.NET vem errors por campo
  if (json && typeof json === 'object' && json.errors) {
    return {
      status: json.status ?? res.status,
      title: json.title ?? 'Erro de validação',
      detail: json.detail,
      errors: json.errors,
    }
  }

  return {
    status: json.status ?? res.status,
    title: json.title ?? res.statusText ?? 'Erro',
    detail: json.detail ?? JSON.stringify(json),
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path))
  if (!res.ok) throw await parseApiError(res)
  return (await res.json()) as T
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await parseApiError(res)
  return (await res.json()) as T
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw await parseApiError(res)
  return (await res.json()) as T
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(buildUrl(path), { method: 'DELETE' })
  if (!res.ok) throw await parseApiError(res)
}

