# BlackFit Frontend

Interface web do sistema BlackFit, desenvolvida para o PEX.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Radix UI
- lucide-react
- Motion

## Como Rodar

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variaveis de Ambiente

Crie ou atualize o arquivo `.env` na raiz do projeto:

```env
API_URL="http://localhost:3000"
```

Essa URL e usada pela camada de API em `src/services/api.ts`.

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

### 4. Gerar Build de Producao

```bash
npm run build
```

## Estrutura do Projeto

- `src/main.tsx`: ponto de entrada da aplicacao.
- `src/app/App.tsx`: componente raiz com o provedor de rotas.
- `src/app/routes.ts`: definicao das rotas da aplicacao.
- `src/app/components`: telas e componentes usados pela interface.
- `src/app/components/ui`: componentes base de UI.
- `src/services/api.ts`: cliente HTTP configurado com `API_URL`.
- `src/assets`: imagens e arquivos estaticos.
- `src/styles`: estilos globais, tema e Tailwind.

## Rotas Disponiveis

- `/`: login.
- `/dashboard`: painel do aluno.
- `/workout/:id`: detalhe do treino.
- `/check-in`: check-in diario e ranking.
- `/rate-instructor`: avaliacao de instrutor.
- `/instructor`: painel do instrutor.

## Camada de API

O arquivo `src/services/api.ts` exporta:

- `API_URL`: URL base lida do `.env`.
- `api.get<T>(path)`.
- `api.post<T>(path, body)`.
- `api.put<T>(path, body)`.
- `api.patch<T>(path, body)`.
- `api.delete<T>(path)`.
- `ApiError`: erro padronizado com `status` e `data`.

Exemplo:

```ts
import { api } from '@/services/api';

type Workout = {
  id: number;
  name: string;
};

const workouts = await api.get<Workout[]>('/workouts');
```

## Status Atual

A interface esta navegavel e usa dados mockados nas telas principais. A camada de API ja esta preparada para conectar o frontend ao backend usando a URL definida no `.env`.

## Objetivo do Projeto

Sistema academico para gestao de academia, com foco na interface de alunos, instrutores e recepcao, permitindo login, visualizacao de treinos, check-in, ranking, avaliacoes e gerenciamento basico de treinos.


proximos passos : 

- [x] Configurar URL base da API
- [x] Criar serviço HTTP com Axios
- [x] Criar integração da rota de login
- [x] Salvar token JWT no localStorage
- [x] Criar controle de autenticação no frontend
- [x] Criar rotas protegidas
- [x] Buscar dados reais do usuário logado
- [x] Criar component para recpção e integrar com back-end
- [x] Integrar dashboard com dados do backend
- [x] Integrar listagem de treinos do aluno
- [x] Integrar detalhes do treino
- [x] Integrar início/finalização de treino
- [x] Integrar cálculo de tempo/calorias
- [x] Integrar check-in diário
- [ ] Integrar ranking de alunos
- [ ] Integrar avaliação do instrutor
- [x] Integrar painel do instrutor
- [x] Integrar criação de treinos
- [x] Integrar atribuição de treinos para alunos
- [ ] Tratar erros da API
- [ ] Criar feedbacks visuais de carregamento
- [ ] Criar mensagens de sucesso e erro
- [ ] Ajustar permissões por perfil: aluno, instrutor e recepcionista
- [ ] Testar fluxo completo com backend rodando
- [ ] Ajustar responsividade das telas
- [ ] Fazer deploy do frontend
- [ ] Configurar variável de ambiente da API no deploy
