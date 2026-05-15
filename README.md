# BarberPro — Sistema de Agendamento para Barbearias

Sistema completo de agendamento online para barbearias, desenvolvido com Next.js 16, Firebase e TypeScript. Interface minimalista com tema dark, fluxo de autenticação completo e gerenciamento de horários em tempo real.

## Visão Geral

Este projeto é uma aplicação web fullstack que permite clientes de uma barbearia agendarem serviços online. O sistema inclui autenticação, seleção de serviços, escolha de profissional, calendário de disponibilidade e gerenciamento de agendamentos.

## Funcionalidades

- **Autenticação completa** — Login/cadastro com email e senha, Google OAuth, recuperação de senha
- **Agendamento em etapas** — Fluxo intuitivo: serviço → profissional → data/hora → confirmação
- **Disponibilidade em tempo real** — Horários ocupados são bloqueados automaticamente via Firestore
- **Gestão de agendamentos** — Visualização, histórico e cancelamento
- **Perfil do usuário** — Edição de dados pessoais e alteração de senha
- **Design responsivo** — Interface adaptável para todos os dispositivos
- **Mapa integrado** — Localização com Google Maps na página de contato

## Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| Next.js 16 | Framework React com App Router |
| TypeScript | Tipagem estática |
| Firebase Auth | Autenticação (email + Google) |
| Cloud Firestore | Banco de dados em tempo real |
| Tailwind CSS 4 | Estilização base |
| CSS Custom | Componentes e animações |
| React Hot Toast | Notificações |
| React Icons | Ícones (Feather Icons) |
| date-fns | Manipulação de datas |

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── layout.tsx            # Layout global
│   ├── globals.css           # Estilos globais
│   ├── agendar/              # Sistema de agendamento
│   ├── cadastro/             # Criação de conta
│   ├── contato/              # Formulário + mapa
│   ├── login/                # Autenticação
│   ├── meus-agendamentos/    # Lista de agendamentos
│   ├── perfil/               # Edição de perfil
│   ├── recuperar-senha/      # Reset de senha
│   ├── servicos/             # Catálogo de serviços
│   └── sobre/                # Sobre o projeto
├── components/
│   ├── Navbar.tsx            # Navegação
│   └── Footer.tsx            # Rodapé
├── contexts/
│   └── AuthContext.tsx       # Context de autenticação
└── lib/
    └── firebase.ts           # Configuração Firebase
```

## Como Executar

### Pré-requisitos

- Node.js 18+
- Conta no Firebase

### Instalação

```bash
git clone https://github.com/seu-usuario/barberpro.git
cd barberpro
npm install
```

### Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative **Authentication** (Email/Senha + Google)
3. Ative **Cloud Firestore**
4. Copie as credenciais para `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

5. Crie um usuário de teste no Firebase Auth:
   - Email: `admin@barberpro.com`
   - Senha: `admin123`

### Executar

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Conta Demo

Para testar sem configurar Firebase:

| Campo | Valor |
|---|---|
| Email | admin@barberpro.com |
| Senha | admin123 |

Na tela de login, clique em **"Usar conta demo"** para preencher automaticamente.

## Screenshots

O projeto utiliza um design minimalista com tema escuro (preto e branco), tipografia moderna e animações suaves. As imagens dos serviços são carregadas via Unsplash.

## Licença

Este projeto está licenciado sob a MIT License — veja o arquivo [LICENSE](LICENSE) para detalhes.
