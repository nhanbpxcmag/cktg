- echo "# cktg" >> README.md
- git init
- git add README.md
- git commit -m "first commit"
- git branch -M main
- git remote add origin https://github.com/nhanbpxcmag/cktg.git
- git push -u origin main

---

### After you enter .gitignore in your gitignore file, try the following,

- git rm -r --cached .
- git add --all
- git commit -m "ignoring gitignore"
- git push --set-upstream origin master
