Correções aplicadas automaticamente:
- docker-compose.yml reescrito para remover duplicações e erros de sintaxe.
- Mapeamento: frontend container (nginx) escuta porta 80; exposta como host:3000.
- backend exposto na porta 3001 e usa ./backend/.env através de env_file.
- db (Postgres) configurado com volume pgdata e init.sql montado.

Sugestões se ainda não conseguir acessar:
- Rode `docker compose up --build` no diretório deste projeto.
- Verifique se nenhuma outra aplicação está usando as portas 3000/3001/5432.
- Se estiver usando WSL2/Windows, confirme que Docker está rodando e as portas estão liberadas.

Gerado automaticamente pelo assistente.
