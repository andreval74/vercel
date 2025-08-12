
# 🚀 SCCafé - Deploy no Vercel

## Configuração de Variáveis de Ambiente no Vercel

Após fazer o deploy, configure estas variáveis no painel do Vercel:

### Variáveis Obrigatórias:

```
NEXTAUTH_URL=https://seu-projeto.vercel.app
NEXTAUTH_SECRET=uma-chave-muito-longa-e-secreta-de-pelo-menos-32-caracteres
```

### Como configurar:

1. Vá para o painel do Vercel
2. Selecione seu projeto
3. Vá em "Settings" > "Environment Variables"
4. Adicione as variáveis acima
5. Faça um novo deploy (ou será automático)

## URLs do Sistema:

- **Home:** https://seu-projeto.vercel.app/
- **Criar Token:** https://seu-projeto.vercel.app/create
- **Dashboard:** https://seu-projeto.vercel.app/dashboard
- **Admin:** https://seu-projeto.vercel.app/admin

## Domínio Personalizado (Opcional):

1. No Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções
4. Atualize NEXTAUTH_URL com o novo domínio

---

✅ **Sistema pronto para produção!**
🔗 **Repositório:** https://github.com/seu-usuario/sccafe-create2
🌐 **Deploy:** https://seu-projeto.vercel.app
