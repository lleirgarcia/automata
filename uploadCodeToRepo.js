const simpleGit = require('simple-git');
const git = simpleGit();
const { execSync } = require('child_process');
const branch = execSync('git branch --show-current').toString().trim();
require('dotenv').config();

const commitMessage = 'auto adding images to repo.';

function runGitCommand(command) {
    execSync(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error: ${err}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

async function pushImagesToRepo() {
    try {
        // Configurar usuario y email
        runGitCommand('git config --global user.email "lleirgarcia@gmail.com"');
        runGitCommand('git config --global user.name "automatic_upload"');

        // Obtener el token de GitHub
        const token = process.env.GACTIONS_ACCESTOKEN;
        console.log("actions: " + token)
        const repoName = 'automata'; // Reemplazar con el nombre real de tu repositorio
        const username = 'lleirgarcia'; // Reemplazar con tu usuario de GitHub

        // Cambiar la URL del repositorio para incluir el token
        const repoUrlWithToken = `https://${token}@github.com/${username}/${repoName}.git`;
        await git.remote(['set-url', 'origin', repoUrlWithToken]);

        const gitRepoUrl = execSync('git config --get remote.origin.url').toString().trim();
        console.log(`URL del repositorio Git actual: ${gitRepoUrl}`);

        // Añadir, commit y push
        await git.add('./*');
        console.log('Archivos añadidos');
        await git.commit(commitMessage);
        console.log('Commit realizado');
        await git.push('origin', branch);
        console.log('Cambios empujados al repositorio');
    } catch (error) {
        console.error('Error:', error);
    }
}

exports.pushImagesToRepo = pushImagesToRepo;