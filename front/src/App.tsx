//  menu lateral + área principal com as rotas de cada tela
import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { CategoriasPage } from './pages/CategoriasPage'
import { PessoasPage } from './pages/PessoasPage'
import { TotaisPorCategoriaPage } from './pages/TotaisPorCategoriaPage'
import { TotaisPorPessoaPage } from './pages/TotaisPorPessoaPage'
import { TransacoesPage } from './pages/TransacoesPage'

function App() {
  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandTitle">Controle de Gastos</div>
          <div className="brandSub muted">React + TypeScript</div>
        </div>

        <nav className="nav">
          <NavLink to="/pessoas" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Pessoas
          </NavLink>
          <NavLink to="/categorias" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Categorias
          </NavLink>
          <NavLink to="/transacoes" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Transações
          </NavLink>
          <NavLink to="/relatorios/totais-por-pessoa" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Totais por pessoa
          </NavLink>
          <NavLink to="/relatorios/totais-por-categoria" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Totais por categoria
          </NavLink>
        </nav>

        <div className="sidebarFooter muted">
          API em <span className="mono">{import.meta.env.VITE_API_BASE_URL}</span>
        </div>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<PessoasPage />} />
          <Route path="/pessoas" element={<PessoasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/transacoes" element={<TransacoesPage />} />
          <Route path="/relatorios/totais-por-pessoa" element={<TotaisPorPessoaPage />} />
          <Route path="/relatorios/totais-por-categoria" element={<TotaisPorCategoriaPage />} />
          <Route
            path="*"
            element={
              <div className="page">
                <h1>Não encontrado</h1>
                <p className="muted">Verifique o menu à esquerda.</p>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
