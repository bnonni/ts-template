import { readFile } from 'fs/promises';
const gitconfig = await readFile(`${process.env.HOME}/.gitconfig`, 'utf-8');
const gitconfigUserEmail = gitconfig.match(/(email = .*)/g)?.[0];
const gitconfigUserName = gitconfig.match(/(name = .*)/g)?.[0];
console.log('gitconfigUserEmail:', gitconfigUserEmail);
console.log('gitconfigUserName:', gitconfigUserName);
if(gitconfigUserEmail) {
  const [_, email] = gitconfigUserEmail.split('=');
  console.log('email:', email);
}
if(gitconfigUserName) {
  const [_, name] = gitconfigUserName.split('=');
  console.log('name:', name);
}