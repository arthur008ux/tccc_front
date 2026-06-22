const API = "https://sistematcc-back-end-production.up.railway.app";

const tabela =
document.getElementById(
    "tabelaEmpresas"
);

const form =
document.getElementById(
    "formEmpresa"
);

window.onload = () => {

    carregarEmpresas();

};

async function carregarEmpresas() {

    try {

        tabela.innerHTML = "";

        const resposta =
        await fetch(
            `${API}/empresas`
        );

        const empresas =
        await resposta.json();

        empresas.forEach(empresa => {

            tabela.innerHTML += `
                <tr>

                    <td>${empresa.id_empresa}</td>

                    <td>${empresa.nome_empresa}</td>

                    <td>${empresa.endereco}</td>

                    <td>${empresa.telefone}</td>

                    <td>

                        <button
                            class="btn-delete"
                            onclick="excluirEmpresa(${empresa.id_empresa})">

                            <i class="fas fa-trash"></i>

                        </button>

                    </td>

                </tr>
            `;

        });

    } catch (erro) {

        console.error(erro);

        Swal.fire({
            icon:"error",
            title:"Erro",
            text:"Falha ao carregar empresas."
        });

    }

}

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const nome_empresa =
        document.getElementById(
            "nomeEmpresa"
        ).value.trim();

        const endereco =
        document.getElementById(
            "enderecoEmpresa"
        ).value.trim();

        const telefone =
        document.getElementById(
            "telefoneEmpresa"
        ).value.trim();

        try {

            const resposta =
            await fetch(
                `${API}/empresas`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        nome_empresa,
                        endereco,
                        telefone
                    })
                }
            );

            const dados =
            await resposta.json();

            if(!resposta.ok){

                Swal.fire({
                    icon:"error",
                    title:"Erro",
                    text:dados.mensagem
                });

                return;
            }

            Swal.fire({
                icon:"success",
                title:"Sucesso",
                text:dados.mensagem
            });

            form.reset();

            carregarEmpresas();

        } catch (erro) {

            console.error(erro);

            Swal.fire({
                icon:"error",
                title:"Erro",
                text:"Falha ao cadastrar empresa."
            });

        }

    }
);

async function excluirEmpresa(id){

    const confirma =
    await Swal.fire({

        title:"Excluir empresa?",

        icon:"warning",

        showCancelButton:true,

        confirmButtonText:"Sim",

        cancelButtonText:"Cancelar"

    });

    if(!confirma.isConfirmed)
        return;

    try {

        const resposta =
        await fetch(
            `${API}/empresas/${id}`,
            {
                method:"DELETE"
            }
        );

        const dados =
        await resposta.json();

        Swal.fire({
            icon:"success",
            title:"Sucesso",
            text:dados.mensagem
        });

        carregarEmpresas();

    } catch (erro) {

        Swal.fire({
            icon:"error",
            title:"Erro",
            text:"Falha ao excluir."
        });

    }

}