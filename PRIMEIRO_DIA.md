# Primeiro dia, 12/2/2025

Resuminho do primeiro dia com as ferramentas que passamos e links úteis:

- GoDaddy, registrar de dominios: https://www.godaddy.com/
- Vultr, pra deployar a máquina (VPS), link com $300 grátis no primeiro mês: https://www.vultr.com/?ref=9666505-9Je
- Comandos para gerar uma chave SSH pra acessar a máquina:

  - `ssh-keygen`
  - Depois de criada,

  ```
  eval `ssh-agent` && ssh-add ~/.ssh/NOME_DA_CHAVE
  ```

  - Loga no server Vultr com
  - O comando ssh, `ssh root@IP_DO_SERVER`
  - Coloca a senha do painel do Vultr
  - Navega pra pasta .ssh: `cd ./.ssh`
  - Edita o `authorized_keys` e adiciona tua chave publica, `nano authorized_keys`
  - A chave pra adicionar no `authorized_keys` você encontra no seu PC, em `~/.ssh/NOME_DA_CHAVE.pub`, lembra do `.pub` no final
  - Pra sair do `nano`, `Ctrl+X` e depois `y`
- Vai na GoDaddy e cria um record `A` com name `@` e value o `IP_DO_SERVER`
  - Pra api, cria outro com name `api` ao invés de `@` mas mesmo value `IP_DO_SERVER`, porque vamos hospedar os dois na mesma máquina

- Pra instalar o básico pra máquina funcionar pra internet e buildar aplicações

  - ufw disable (mata o firewall)
  - nvm, pro node, https://github.com/nvm-sh/nvm
  - caddy, pro HTTPS/SSL, https://caddyserver.com/docs/install
  - mongodb, pra ter um banco, https://www.mongodb.com/pt-br/docs/manual/administration/install-community/

- Pro Caddy, Caddyfile se encontra em `/etc/caddy/Caddyfile`

  - Navega pra pasta do caddy, `cd /etc/caddy`
  - Edita o Caddyfile, `nano Caddyfile`
  - Reinicia o Caddy, `caddy fmt --overwrite && caddy reload`
  - No nosso caso, adicionamos API e front pro Caddy, exemplo de config do Caddy

  ```
  api.mamaco.work {
    reverse_proxy localhost:3040
  }

  mamaco.work {
  	root * /usr/share/caddy/front-aulinha/dist
  	file_server
  }

  :80 {
  	# Set this path to your site's directory.
  	root * /usr/share/caddy

  	# Enable the static file server.
  	file_server

  	# Another common task is to set up a reverse proxy:
  	# reverse_proxy localhost:8080

  	# Or serve a PHP site through php-fpm:
  	# php_fastcgi localhost:9000
  }
  ```

- Link do repositório do back: https://github.com/pedropalhari/api-aulinha
- Link do repositório do front: https://github.com/pedropalhari/front-aulinha

- Ambos com `npm`, só dar `npm install`,

  - Front, pra aparecer pra internet, tem que estar na pasta `root` da configuração do caddy acima, `/usr/share/caddy/front-aulinha`, entrar e dar um `npm run build`
  - Back, pra rodar pra sempre, recomendado instalar o `pm2` com `npm i -g pm2` e rodar com `pm2 start index.pm2.js`
    - Pra rodar só pra testar ou em dev, `node -r tsm ./index.ts`

- Pra expor o MongoDB pra sua máquina local, spawnamos um SSH Tunnel, `ssh -L 27017:localhost:27017 root@IP_DO_SERVER`

Libs importantes do back:
  - `tsm`, pra rodar o código typescript
  - `fastify`, nosso servidor HTTP, com `@fastify/cors`
  - `mongodb`, pra falar com o MongoDB e guardar os usuários