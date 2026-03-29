1. Branch

---

| Prefix       | Fungsi                          |
| ------------ | ------------------------------- |
| `feat/*`     | fitur baru                      |
| `fix/*`      | bug fix                         |
| `style/*`    | UI / styling                    |
| `refactor/*` | perbaikan kode tanpa ubah fitur |
| `test/*`     | testing                         |
| `chore/*`    | config, setup, dll              |

Contoh penamaan branch
feat/auth-login
feat/auth-register
feat/product-crud
fix/cart-total

2. Alur

```bash
git checkout main
git pull origin main

git checkout -b feat/auth-login

# kerja...

git add .
git commit -m "feat: add login feature"
git push origin feat/auth-login

PR(pull request)
git push origin feat/auth-login //ganti nama branch sesuai dengan prefix dan nama fitur
```
