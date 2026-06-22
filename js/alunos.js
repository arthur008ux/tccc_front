

const tabelaBody = document.getElementById("tabelaBody");
const formAluno = document.getElementById("formAluno");

// ======================
// INIT
// ======================
window.onload = () => {
    carregarEmpresas();
    carregarCursos();
    carregarAlunos();
};

// ======================
// EMPRESAS
// ======================
async function carregarEmpresas() {
    try {
        const resposta = await fetch(`${API}/empresas`);
        if (!resposta.ok) return;

        const empresas = await resposta.json();
        const select = document.getElementById("empresaAluno");

        select.innerHTML = '<option value="">Selecione a empresa</option>';

        empresas.forEach(empresa => {
            select.innerHTML += `
                <option value="${empresa.id_empresa}">
                    ${empresa.nome_empresa}
                </option>
            `;
        });

    } catch (erro) {
        console.error("Erro empresas:", erro);
    }
}

// ======================
// CURSOS
// ======================
async function carregarCursos() {
    try {
        const resposta = await fetch(`${API}/cursos`);
        if (!resposta.ok) return;

        const cursos = await resposta.json();
        const select = document.getElementById("cursoAluno");

        select.innerHTML = '<option value="">Selecione o curso</option>';

        cursos.forEach(curso => {
            select.innerHTML += `
                <option value="${curso.id_curso}">
                    ${curso.nome_curso}
                </option>
            `;
        });

    } catch (erro) {
        console.error("Erro cursos:", erro);
    }
}

// ======================
// LISTAR ALUNOS
// ======================
async function carregarAlunos() {
    try {
        const resposta = await fetch(`${API}/alunos`);
        if (!resposta.ok) return;

        const alunos = await resposta.json();

        tabelaBody.innerHTML = "";

        alunos.forEach(aluno => {
            tabelaBody.innerHTML += `
                <tr>
                    <td>${aluno.matricula ?? ""}</td>
                    <td>${aluno.nome ?? ""}</td>
                    <td>${aluno.email ?? ""}</td>
                    <td>${aluno.nome_empresa ?? ""}</td>
                    <td>${aluno.nome_curso ?? ""}</td>
                    <td>
                        <button class="btn-edit" onclick="editarAluno(${aluno.id_aluno})">✏️</button>
                        <button class="btn-delete" onclick="excluirAluno(${aluno.id_aluno})">🗑️</button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error("Erro alunos:", erro);
    }
}

// ======================
// CADASTRAR ALUNO
// ======================
formAluno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nomeAluno").value.trim();
    const matricula = document.getElementById("matriculaAluno").value.trim();
    const email = document.getElementById("emailAluno").value.trim();
    const id_empresa = document.getElementById("empresaAluno").value;
    const id_curso = document.getElementById("cursoAluno").value;

    if (!nome || !matricula || !email || !id_empresa || !id_curso) {
        Swal.fire({
            icon: "warning",
            title: "Atenção",
            text: "Preencha todos os campos!"
        });
        return;
    }

    try {
        const resposta = await fetch(`${API}/alunos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                matricula,
                email,
                id_empresa,
                id_curso
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: dados.mensagem || "Erro ao cadastrar"
            });
            return;
        }

        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: dados.mensagem || "Aluno cadastrado!"
        });

        formAluno.reset();
        carregarAlunos();

    } catch (erro) {
        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao cadastrar aluno."
        });
    }
});

// ======================
// EXCLUIR ALUNO
// ======================
async function excluirAluno(id) {
    const confirma = await Swal.fire({
        title: "Excluir aluno?",
        text: "Essa ação não poderá ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar"
    });

    if (!confirma.isConfirmed) return;

    try {
        const resposta = await fetch(`${API}/alunos/${id}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: dados.mensagem || "Aluno excluído"
        });

        carregarAlunos();

    } catch (erro) {
        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao excluir aluno."
        });
    }
}

// ======================
// EDITAR ALUNO
// ======================
async function editarAluno(id) {
    try {
        const resposta = await fetch(`${API}/alunos/${id}`);
        const aluno = await resposta.json();

        const resultado = await Swal.fire({
            title: "Editar Aluno",
            html: `
                <input id="swalNome" class="swal2-input" value="${aluno.nome ?? ""}">
                <input id="swalMatricula" class="swal2-input" value="${aluno.matricula ?? ""}">
                <input id="swalEmail" class="swal2-input" value="${aluno.email ?? ""}">
            `,
            showCancelButton: true,
            preConfirm: () => {
                return {
                    nome: document.getElementById("swalNome").value,
                    matricula: document.getElementById("swalMatricula").value,
                    email: document.getElementById("swalEmail").value,
                    id_empresa: aluno.id_empresa,
                    id_curso: aluno.id_curso
                };
            }
        });

        if (!resultado.isConfirmed) return;

        const respostaUpdate = await fetch(`${API}/alunos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resultado.value)
        });

        const dados = await respostaUpdate.json();

        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: dados.mensagem || "Aluno atualizado"
        });

        carregarAlunos();

    } catch (erro) {
        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao atualizar aluno."
        });
    }
}