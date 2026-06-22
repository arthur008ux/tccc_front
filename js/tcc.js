const API = "https://sistematcc-back-end-production.up.railway.app";

const form =
document.getElementById("formTcc");

const selectAluno =
document.getElementById("aluno");

const tabelaTccs =
document.getElementById("tabelaTccs");

window.onload = () => {

    carregarAlunos();

    carregarTccs();

};

async function carregarAlunos() {

    try {

        const resposta =
        await fetch(
            `${API}/alunos`
        );

        const alunos =
        await resposta.json();

        selectAluno.innerHTML =
        '<option value="">Selecione</option>';

        alunos.forEach(aluno => {

            selectAluno.innerHTML += `
                <option value="${aluno.id_aluno}">
                    ${aluno.nome}
                </option>
            `;

        });

    } catch (erro) {

        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao carregar alunos."
        });

    }

}

async function carregarTccs() {

    try {

        const resposta =
        await fetch(
            `${API}/tccs`
        );

        const tccs =
        await resposta.json();

        tabelaTccs.innerHTML = "";

        tccs.forEach(tcc => {

            tabelaTccs.innerHTML += `

<tr>

    <td>${tcc.titulo}</td>

    <td>${tcc.nome}</td>

    <td>${tcc.nome_curso}</td>

    <td>${tcc.nome_empresa}</td>

    <td>

        <select
            onchange="alterarStatus(${tcc.id_tcc}, this.value)">

            <option
                value="EM_ANALISE"
                ${tcc.status === "EM_ANALISE" ? "selected" : ""}>

                Em Análise

            </option>

            <option
                value="APROVADO"
                ${tcc.status === "APROVADO" ? "selected" : ""}>

                Aprovado

            </option>

            <option
                value="REPROVADO"
                ${tcc.status === "REPROVADO" ? "selected" : ""}>

                Reprovado

            </option>

        </select>

    </td>

    <td>

        <a
            class="btn-pdf"
            href="${API}/uploads/${tcc.arquivo_pdf}"
            target="_blank">

            Ver PDF

        </a>

    </td>

    <td>

        <button
            class="btn-action btn-delete"
            onclick="excluirTcc(${tcc.id_tcc})">

            Excluir

        </button>

    </td>

</tr>

`;

        });

    } catch (erro) {

        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao carregar TCCs."
        });

    }

}

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const formData =
        new FormData();

        formData.append(
            "titulo",
            document.getElementById("titulo").value
        );

        formData.append(
            "resumo",
            document.getElementById("resumo").value
        );

        formData.append(
            "id_aluno",
            document.getElementById("aluno").value
        );

        formData.append(
            "arquivo",
            document.getElementById("arquivo").files[0]
        );

        try {

            const resposta =
            await fetch(
                `${API}/tccs`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const dados =
            await resposta.json();

            if (!resposta.ok) {

                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: dados.mensagem
                });

                return;

            }

            Swal.fire({
                icon: "success",
                title: "Sucesso",
                text: "TCC cadastrado com sucesso!"
            });

            form.reset();

            carregarTccs();

        } catch (erro) {

            console.error(erro);

            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Falha ao cadastrar TCC."
            });

        }

    }
);

async function excluirTcc(id) {

    const confirma =
    await Swal.fire({

        title: "Excluir TCC?",

        text: "Essa ação não poderá ser desfeita.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Excluir",

        cancelButtonText: "Cancelar"

    });

    if (!confirma.isConfirmed)
        return;

    try {

        const resposta =
        await fetch(
            `${API}/tccs/${id}`,
            {
                method: "DELETE"
            }
        );

        const dados =
        await resposta.json();

        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: dados.mensagem
        });

        carregarTccs();

    } catch (erro) {

        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Falha ao excluir TCC."
        });

    }

}

async function alterarStatus(id, status) {

    try {

        const busca =
        await fetch(
            `${API}/tccs/${id}`
        );

        const tcc =
        await busca.json();

        const resposta =
        await fetch(
            `${API}/tccs/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type":
                    "application/json"
                },
                body: JSON.stringify({

                    titulo: tcc.titulo,

                    resumo: tcc.resumo,

                    status: status,

                    id_aluno: tcc.id_aluno

                })
            }
        );

        const dados =
        await resposta.json();

        if (!resposta.ok) {

            Swal.fire({
                icon: "error",
                title: "Erro",
                text: dados.mensagem
            });

            return;

        }

        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: "Status atualizado!"
        });

        carregarTccs();

    } catch (erro) {

        console.error(erro);

        Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Não foi possível atualizar o status."
        });

    }

}