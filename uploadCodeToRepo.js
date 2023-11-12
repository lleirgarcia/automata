const simpleGit = require('simple-git');
const git = simpleGit();

const commitMessage = 'auto adding images to repo.';

async function pushImagesToRepo() {
    try {
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
        await git.push('origin', 'develop'); // Asegúrate de cambiar 'master' por el nombre de tu rama si es diferente
        console.log('Cambios empujados al repositorio');
    } catch (error) {
        console.error('Error:', error);
    }
}

exports.pushImagesToRepo = pushImagesToRepo