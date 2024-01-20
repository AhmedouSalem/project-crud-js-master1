// Récupération des éléments du DOM
var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    firstName = document.getElementById("firstName"),
    lastName = document.getElementById("lastName"),
    genderM = document.getElementById("genderM"),
    genderF = document.getElementById("genderF"),
    sDate = document.getElementById("sDate"),
    submitBtn = document.querySelector(".submit"),
    userInfo = document.getElementById("data"),
    modal = document.getElementById("userForm"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser");

// Récupération des données depuis le stockage local ou initialisation à un tableau vide
let getData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : [];

// Variables pour le suivi de l'état d'édition du formulaire
let isEdit = false, editId;

// Appel de la fonction pour afficher les informations initiales
showInfo();

// Gestionnaire d'événements pour le bouton "Nouvel utilisateur"
newUserBtn.addEventListener('click', () => {
    // Réinitialisation du formulaire
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Fill the Form";
    isEdit = false;
    imgInput.src = "../image/Profile Icon.webp";
    form.reset();
});

// Gestionnaire d'événements pour le changement de fichier
file.onchange = function () {
    // Vérification de la taille du fichier
    if (file.files[0].size < 1000000) {  // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function (e) {
            // Affichage de l'image sélectionnée
            imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };

        fileReader.readAsDataURL(file.files[0]);
    } else {
        alert("This file is too large!");
    }
};

// Fonction pour afficher les informations dans le tableau
function showInfo() {
    // Suppression des éléments existants du tableau
    document.querySelectorAll('.employeeDetails').forEach(info => info.remove());

    // Boucle sur les données pour créer les éléments du tableau
    getData.forEach((element, index) => {
        let createElement = `<tr class="employeeDetails">
            <td>${index + 1}</td>
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>
            <td>${element.employeeName}</td>
            <td>${element.employeelastName}</td>
            <td>${element.employeegender}</td>
            <td>${element.startDate}</td>
            <td>
                <button class="btn btn-success" onclick="readInfo('${element.picture}', '${element.employeeName}', '${element.employeelastName}', '${element.employeegender}','${element.startDate}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${index}, '${element.picture}', '${element.employeeName}', '${element.employeelastName}', '${element.employeegender}', '${element.startDate}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`;

        // Ajout de l'élément au tableau HTML
        userInfo.innerHTML += createElement;
    });
}

// Appel initial de la fonction pour afficher les informations
showInfo();

// Fonction pour afficher les informations dans le formulaire de lecture
function readInfo(pic, firstName, lastName, gender, sDate) {
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showFirstName').value = firstName;
    document.querySelector("#showLastName").value = lastName;
    document.querySelector("#showGenderM").checked = (gender === "M");
    document.querySelector("#showGenderF").checked = (gender === "F");
    document.querySelector("#showsDate").value = sDate;
}

// Fonction pour pré-remplir le formulaire lors de l'édition
function editInfo(index, pic, first_Name, last_Name, gender_, Sdate_) {
    isEdit = true;
    editId = index;
    imgInput.src = pic;
    firstName.value = first_Name;
    lastName.value = last_Name;
    sDate.value = Sdate_;
    genderM.checked = (gender_ === "M");
    genderF.checked = (gender_ === "F");
    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update The Form";
}

// Fonction pour supprimer une entrée du tableau
function deleteInfo(index) {
    if (confirm("Are you sure want to delete?")) {
        getData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(getData));
        showInfo();
    }
}

// Gestionnaire d'événements pour le formulaire de soumission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Création d'un objet avec les informations du formulaire
    const information = {
        picture: imgInput.src || "../image/Profile Icon.webp",
        employeeName: firstName.value,
        employeelastName: lastName.value,
        employeegender: genderM.checked ? "M" : "F",
        startDate: sDate.value
    };

    // Ajout ou mise à jour des données dans le tableau
    if (!isEdit) {
        getData.push(information);
    } else {
        isEdit = false;
        getData[editId] = information;
    }

    // Stockage des données dans le stockage local
    localStorage.setItem('userProfile', JSON.stringify(getData));

    // Réinitialisation du formulaire et mise à jour du tableau
    submitBtn.innerText = "Submit";
    modalTitle.innerHTML = "Fill The Form";
    showInfo();
    form.reset();
    imgInput.src = "../image/Profile Icon.webp";
    
    // Fermer le modal après la soumission du formulaire
    $('#userForm').modal('hide');
});

$(document).ready(function() {
    $('#myDataTable').DataTable({
        paging: true,
        dom: 'lrtip',
        columnDefs: [
            { targets: -1, orderable: false } // Désactive le tri pour la dernière colonne
        ],
    });

    // Personnalisez le champ de recherche
    $('#customSearchInput').on('keyup', function() {
        $('#myDataTable').DataTable().search($(this).val()).draw();
    });
});

