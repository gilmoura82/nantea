# Nantea — protótipo pra testar

Este é um projeto Vite + React completo e rodável, montado a partir das telas
que a gente construiu na conversa. Ele existe pra você conseguir testar tudo
localmente, clicando de verdade — não é o mesmo código do seu projeto no
Base44, mas segue o fluxo e o visual que definimos juntos.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. O microfone (recado da mamãe) só funciona
em `localhost` ou HTTPS — é restrição do navegador, não bug.

## Fluxo implementado

Welcome → Quem vai usar → PIN do responsável → Cadastro → Escolha do
amiguinho → Início.

## O que é stub (só pra este teste rodar sozinho)

- `src/components/ui/button.jsx`, `input.jsx`, `textarea.jsx` — versões bem
  simples, só com as classes Tailwind que as telas já usam. **No projeto
  real de vocês, troquem pelos componentes do shadcn/ui que já existem lá.**
- `src/lib/profileStore.js` — implementação simples com `localStorage`. Se
  vocês já têm um `profileStore.js` de verdade no Base44, usem o de vocês —
  as funções que as telas chamam são: `getProfileId`, `saveWhoUses`,
  `saveProfile`, `saveCompanion`, `getCompanion`, `saveMomMessage`,
  `getMomMessage`.

## Limitações importantes pra saber testando

- **Áudio da mamãe não sobrevive a recarregar a página.** A gravação vira um
  "blob URL" temporário do navegador — pra persistir de verdade entre
  sessões, precisa subir o áudio pra algum servidor (ou salvar como base64,
  o que fica pesado pra `localStorage`).
- **O PIN do responsável só protege no navegador.** Impede a criança de
  entrar sem querer, mas não impede alguém que sabe mexer no DevTools. Pra
  proteção de verdade, o PIN precisa ser validado num servidor.
- **Foto do amiguinho**: o upload é só de bichinho/objeto, nunca de pessoa —
  isso é intencional (a gente conversou bastante sobre isso). Não tem
  validação técnica impedindo o upload de uma foto de pessoa, só o aviso na
  tela — se quiserem reforçar isso de verdade, precisaria de alguma
  moderação de imagem.

## Próximos passos sugeridos

1. Testar o fluxo inteiro localmente.
2. Trocar os stubs de UI pelos componentes reais do shadcn/ui de vocês.
3. Trocar o `profileStore.js` local pelo de vocês (ou decidir manter este,
   se ainda não existir um).
4. Decidir onde o áudio/fotos vão ser salvos de verdade (backend/storage).
