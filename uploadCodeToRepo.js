const simpleGit = require('simple-git');
const git = simpleGit();
const { execSync } = require('child_process');
const branch = execSync('git branch --show-current').toString().trim();

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
        runGitCommand('git config --global user.email "lleirgarcia@gmail.com"');
        runGitCommand('git config --global user.name "automatic_upload"');
        // Verificar el estado del repositorio
        // const status = await git.status();
        // console.log(status);

        // Añadir archivos al staging area
        await git.add('./*');
        console.log('Archivos añadidos');

        // Realizar el commit
        await git.commit(commitMessage);
        console.log('Commit realizado');

        // Empujar los cambios
        await git.push('origin', branch); // Asegúrate de cambiar 'master' por el nombre de tu rama si es diferente
        console.log('Cambios empujados al repositorio');
    } catch (error) {
        console.error('Error:', error);
    }
}

pushImagesToRepo()