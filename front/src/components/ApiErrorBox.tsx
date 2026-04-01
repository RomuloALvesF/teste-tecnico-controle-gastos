import type { ApiError } from '../api/http'

// Exibe título + detalhes e se vier os erros por campo validação 400 da API.
export function ApiErrorBox({ error }: { error: ApiError | null }) {
  if (!error) return null

  const entries = error.errors ? Object.entries(error.errors) : []

  return (
    <div className="errorBox" role="alert">
      <strong>
        {error.title} (HTTP {error.status})
      </strong>
      {error.detail ? <div className="muted">{error.detail}</div> : null}
      {entries.length ? (
        <ul className="errorList">
          {entries.map(([field, msgs]) =>
            msgs.map((m, idx) => (
              <li key={`${field}-${idx}`}>
                <span className="mono">{field}</span>: {m}
              </li>
            )),
          )}
        </ul>
      ) : null}
    </div>
  )
}

