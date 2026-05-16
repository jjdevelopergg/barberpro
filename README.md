# Barbearia — Sistema de Agendamento

🔗 [barbearia-nu-topaz.vercel.app](https://barbearia-nu-topaz.vercel.app)

Sistema web completo de agendamento online para barbearias com painel administrativo, autenticação, gerenciamento de horários e interface responsiva.

## Funcionalidades

**Cliente:**
- Autenticação (login, cadastro, recuperação de senha, Google)
- Agendamento em 4 etapas (serviço → profissional → data/hora → confirmação)
- Calendário inteligente (dias úteis do mês atual, horários passados desabilitados)
- Perfil dos profissionais com foto, bio e anos de experiência
- Gerenciamento de agendamentos (visualização, cancelamento)
- Política de cancelamento (mínimo 1 hora de antecedência)
- Tolerância de 15 minutos de atraso com justificativa
- Botão para ver localização no mapa
- Persistência de sessão (não desloga ao recarregar)

**Painel Administrativo:**
- Dashboard com estatísticas (total, próximos, hoje, cancelados)
- Visualização de todos os agendamentos de todos os clientes
- Agendamentos agrupados por dia em ordem cronológica
- Filtros (todos, próximos, cancelados)
- Busca por nome, email ou serviço
- Cancelamento de qualquer agendamento

**Interface:**
- Design minimalista preto e branco
- Animações de entrada nas seções (scroll reveal)
- Responsivo (mobile + desktop)
- Mapa integrado na página de contato

## Tecnologias

- Next.js 16
- TypeScript
- Tailwind CSS 4
- date-fns
- React Hot Toast
- React Icons
- Vercel (deploy)

## Licença

Consulte o arquivo [LICENSE](LICENSE).
