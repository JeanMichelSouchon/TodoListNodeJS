const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout// créer l'interface utilisateur
});

var tasks = [];// déclaration de l'array qui permet de récupérer les taches de la todolist

function loadTasks() {// fonction qui va permettre de charger les taches depuis le fichier json (Initialise le fichier)
  try {
    const data = fs.readFileSync('tasks.json', 'utf8'); // lecture du fichier json
    tasks = JSON.parse(data); // on affecte le contenu du fichier (data) dans la variable tasks
  } catch (err) {
    tasks = []; // si une erreur alors on laisse la variable vide
  }
}

// fonction qui va permettre de sauvegarder dans le fichier tasks.json
function saveTasks() {
  const data = JSON.stringify(tasks);//convertion des données récupéré en string pour json
  fs.writeFileSync('tasks.json', data);// écriture de ces données dans le fichier tasks.json
}
//fonction d'ajout de tache à la liste
function addTask(title) {
  const newTask = {
    id: tasks.length + 1,
    title: title,
    isDone: false
  };
  tasks.push(newTask);// récupère la saisie de l'utilisateur et actualise le contenu de l'array avec la saisie utilisateur
  saveTasks();// appel de la fonction de sauvegarde
  console.log('Tâche ajoutée :', title);// confirmation de l'ajout
}


//fonction qui permet de lister les taches existantes
function listTasks() { // pour chaque "taches" dans le fichier json
  console.log('Liste des tâches :');
  tasks.forEach(task => {
    console.log(`${task.id}. [${task.isDone ? 'X' : ' '}] ${task.title}`);// il ecris le numéro de la taches, puis si elle est coché ou non
  });                                                                     // puis affiche le nom de la taches
}

//fonction qui permet de supprimer une tache
function deleteTask(index) {
  if (index >= 0 && index < tasks.length) {// si l'index selectionné est entre ou = a 0 et plus petit que la taile max de l'array tasks
    const deletedTask = tasks.splice(index, 1)[0];// supprime la tache ciblé par l'utilisateur ( le splice permet de suprrimer une valeur d'un array)
    saveTasks();
    console.log('Tâche supprimée :', deletedTask.title);// confirmation et affiche le nom de la tache supprimé 
  } else {
    console.log('Indice de tâche invalide');
  }
}

// fonction qui permet de marquer les taches selectionné (fini ou non)
function markTaskDone(index) {
  if (index >= 0 && index < tasks.length) {// si l'index selectionné est entre ou = a 0 et plus petit que la taile max de l'array tasks
    tasks[index].isDone = true;//mddifie la valeur isDone = true
    saveTasks();
    console.log('Tâche marquée comme terminée :', tasks[index].title);// confirme la saisie
  } else {
    console.log('Indice de tâche invalide');
  }
}
//fonction qui permet d'enlever le marquage des taches terminée
function unmarkTaskDone(index) {
  if (index >= 0 && index < tasks.length) {// si l'index selectionné est entre ou = a 0 et plus petit que la taile max de l'array tasks
    tasks[index].isDone = false;//mddifie la valeur isDone = false
    saveTasks();// sauvegarde la saisie
    console.log('Tâche marquée comme non terminée :', tasks[index].title);// confirme la saisie
  } else {
    console.log('Indice de tâche invalide');
  }
}

//fonction principal qui servira à demander les actions de l'utilisateur
function askForAction() {
  rl.question('Que souhaitez-vous faire ? (add/list/delete/mark/unmark/exit): ', (action) => { // Au lancement du script ce sera toujours cette question
    switch (action) {// en fonction de la réponse de l'utilisateur
      case 'add':// si il veut ajouter alors
        rl.question('Entrez la nouvelle tâche : ', (title) => {// ajouter la nouvelle taches en utilisant la fonction addtask avec le contenu
          addTask(title);                                      // de la variable task puis on retourne a la fonction principal
          askForAction();// on retourne a la fonction principal
        });
        break;
      case 'list'://affiche la list des taches existantes
        listTasks();
        askForAction();// on retourne a la fonction principal
        break;
      case 'delete':
        rl.question('Entrez le numéro de la tâche à supprimer : ', (index) => {// suprime la taches ciblé en utilisant la fonction deleteTask avec l'index
          deleteTask(parseInt(index) - 1);//le - 1 permet d'eviter la selection de la mauvaise taches  ( un array commence par de 0 )
          askForAction();// on retourne a la fonction principal
        });
        break;
      case 'mark':// si il veut cocher une tache (isDone)
        rl.question('Entrez le numéro de la tâche à marquer comme terminée : ', (index) => {
          markTaskDone(parseInt(index) - 1);//le - 1 permet d'eviter la selection de la mauvaise taches  ( un array commence par de 0 )
          askForAction();// on retourne a la fonction principal
        });
        break;
      case 'unmark':// si il veut décocher une tache (isDone)
        rl.question('Entrez le numéro de la tâche à marquer comme non terminée : ', (index) => {
          unmarkTaskDone(parseInt(index) - 1);//le - 1 permet d'eviter la selection de la mauvaise taches  ( un array commence par de 0 )
          askForAction();// on retourne a la fonction principal
        });
        break;
      case 'exit'://ferme la todolist
        rl.close();
        break;
      default:
        console.log('Commande non reconnue');// toutes autres commande que celle précédement énoncé ne fonctionne pas
        askForAction();// on retourne a la fonction principal
        break;
    }
  });
}

loadTasks();// initialise le fichier json
askForAction();//lance la fonction principal
