const API = "https://sistematcc-back-end-production.up.railway.app";

const params = new URLSearchParams(window.location.search);
const pesquisa = params.get("pesquisa");
const resultado = document.getElementById("resultado");

// ======================
// INIT
// ======================
buscar();

// ======================
// BUSCAR
// ======================
async function buscar() {

    try {

        if (!pesquisa) {
            resultado.innerHTML = `
                <div class="resultado-card">
                    <h2>Digite um termo de pesquisa</h2>
                </div>
            `;
            return;
        }

        let url;

        // matrícula ou nome
        if (/^\d+$/.test(pesquisa)) {
            url = `${API}/pesquisa/${pesquisa}`;
        } else {
            url = `${API}/pesquisa/${encodeURIComponent(pesquisa)}`;
        }

        const resposta = await fetch(url);

        // 🔥 tratamento real de HTTP
        if (!resposta.ok) {
            if (resposta.status === 404) {
                resultado.innerHTML = `
                    <div class="resultado-card">
                        <h2>Nenhum resultado encontrado</h2>
                        <p>Não encontramos dados para essa pesquisa.</p>
                    </div>
                `;
                return;
            }
            throw new Error("Erro no servidor");
        }

        const dados = await resposta.json();

        // 🔥 backend padronizado agora: { sucesso, dados }
        if (!dados.sucesso || !dados.dados) {
            resultado.innerHTML = `
                <div class="resultado-card">
                    <h2>Nenhum resultado encontrado</h2>
                </div>
            `;
            return;
        }

        const tcc = dados.dados;

        const statusClasse =
            (tcc.status || "").toLowerCase() === "aprovado"
                ? "status-concluido"
                : "status-andamento";

        resultado.innerHTML = `
            <div class="table-container">

                <h2>${tcc.titulo || "Sem título"}</h2>

                <div class="resultado-grid">

                    <div class="resultado-card">

                        <h3>Dados do Aluno</h3>

                        <p><strong>Nome:</strong> ${tcc.nome || "-"}</p>
                        <p><strong>Matrícula:</strong> ${tcc.matricula || "-"}</p>
                        <p><strong>Email:</strong> ${tcc.email || "-"}</p>
                        <p><strong>Curso:</strong> ${tcc.nome_curso || "-"}</p>

                    </div>

                    <div class="resultado-card">

                        <h3>Informações do TCC</h3>

                        <p><strong>Empresa:</strong> ${tcc.nome_empresa || "-"}</p>

                        <p>
                            <strong>Status:</strong>
                            <span class="status-badge ${statusClasse}">
                                ${tcc.status || "Indefinido"}
                            </span>
                        </p>

                    </div>

                </div>

                <h3>Resumo</h3>

                <div class="resumo-box">
                    ${tcc.resumo || "Sem resumo"}
                </div>

                ${
                    tcc.arquivo_pdf
                        ? `<a href="${API}/uploads/${tcc.arquivo_pdf}" target="_blank" class="btn-download">
                            📄 Baixar PDF
                           </a>`
                        : ""
                }

            </div>
        `;

    } catch (erro) {

        console.error(erro);

        resultado.innerHTML = `
            <div class="resultado-card">
                <h2>Erro</h2>
                <p>Falha ao conectar ao servidor.</p>
            </div>
        `;
    }
}